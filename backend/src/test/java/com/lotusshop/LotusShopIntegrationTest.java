package com.lotusshop;

import com.lotusshop.model.OrderStatus;
import com.lotusshop.model.Product;
import com.lotusshop.repository.OrderRepository;
import com.lotusshop.repository.ProductRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class LotusShopIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    @BeforeEach
    void resetSeedBeforeEach() throws Exception {
        mockMvc.perform(post("/api/seed/reset"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.productsCount").value(8))
                .andExpect(jsonPath("$.vouchersCount").value(2))
                .andExpect(jsonPath("$.ordersCount").value(4));
    }

    @Test
    void seedDataAndDashboardKpisMatchSpecification() throws Exception {
        List<Product> products = productRepository.findAll();
        assertThat(products).hasSize(8);
        assertThat(products).anyMatch(p -> p.getStock() == 1);
        assertThat(products).anyMatch(p -> p.getStock() == 0);

        mockMvc.perform(get("/api/dashboard/summary"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalCompletedRevenue").value(2710000))
                .andExpect(jsonPath("$.totalOrders").value(4))
                .andExpect(jsonPath("$.lowStockCount").value(3))
                .andExpect(jsonPath("$.averageOrderValue").value(2710000));
    }

    @Test
    void sqaBug01_createProductAllowsZeroAndNegativePriceWhileEditRejectsThem() throws Exception {
        String zeroPricePayload = objectMapper.writeValueAsString(Map.of(
                "name", "Sản phẩm Test Giá 0",
                "category", "Áo",
                "price", 0,
                "stock", 10,
                "imageUrl", ""
        ));

        MvcResult zeroRes = mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(zeroPricePayload))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.price").value(0))
                .andReturn();

        Long createdId = objectMapper.readTree(zeroRes.getResponse().getContentAsString()).get("id").asLong();

        String negativePricePayload = objectMapper.writeValueAsString(Map.of(
                "name", "Sản phẩm Test Giá Âm",
                "category", "Phụ kiện",
                "price", -50000,
                "stock", 5
        ));

        mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(negativePricePayload))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.price").value(-50000));

        // Edit mode still enforces price > 0
        mockMvc.perform(put("/api/products/" + createdId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(negativePricePayload))
                .andExpect(status().isBadRequest());
    }

    @Test
    void sqaBug02_ueh10VoucherIgnores50kCapAbove500kSubtotal() throws Exception {
        // Below 200k -> rejected
        mockMvc.perform(post("/api/vouchers/validate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"code\":\"UEH10\",\"subtotal\":150000}"))
                .andExpect(status().isBadRequest());

        // At 300k -> 30k (normal)
        mockMvc.perform(post("/api/vouchers/validate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"code\":\"UEH10\",\"subtotal\":300000}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.discountAmount").value(30000));

        // Above 500k (1,000,000) -> 100,000 instead of capped 50,000 (SQA-BUG-02)
        mockMvc.perform(post("/api/vouchers/validate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"code\":\"UEH10\",\"subtotal\":1000000}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.discountAmount").value(100000))
                .andExpect(jsonPath("$.finalTotal").value(900000));

        // FREESHIP -> 30,000
        mockMvc.perform(post("/api/vouchers/validate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"code\":\"FREESHIP\",\"subtotal\":290000}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.discountAmount").value(30000));
    }

    @Test
    void checkoutDeductsStockAndRejectsOverStock() throws Exception {
        Product boundaryOne = productRepository.findAll().stream()
                .filter(p -> p.getStock() == 1)
                .findFirst()
                .orElseThrow();

        Product outOfStock = productRepository.findAll().stream()
                .filter(p -> p.getStock() == 0)
                .findFirst()
                .orElseThrow();

        // Buying 2 when stock = 1 must fail
        String overStockOrder = objectMapper.writeValueAsString(Map.of(
                "customerName", "Tester",
                "customerPhone", "0909998888",
                "customerAddress", "TP.HCM",
                "items", List.of(Map.of("productId", boundaryOne.getId(), "quantity", 2))
        ));
        mockMvc.perform(post("/api/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(overStockOrder))
                .andExpect(status().isBadRequest());

        // Buying out of stock item must fail
        String zeroStockOrder = objectMapper.writeValueAsString(Map.of(
                "customerName", "Tester",
                "customerPhone", "0909998888",
                "customerAddress", "TP.HCM",
                "items", List.of(Map.of("productId", outOfStock.getId(), "quantity", 1))
        ));
        mockMvc.perform(post("/api/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(zeroStockOrder))
                .andExpect(status().isBadRequest());

        // Buying 1 when stock = 1 succeeds and reduces stock to 0
        String validOrder = objectMapper.writeValueAsString(Map.of(
                "customerName", "Tester Hợp Lệ",
                "customerPhone", "0909998888",
                "customerAddress", "TP.HCM",
                "voucherCode", "UEH10",
                "items", List.of(Map.of("productId", boundaryOne.getId(), "quantity", 1))
        ));
        mockMvc.perform(post("/api/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validOrder))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("PENDING"))
                .andExpect(jsonPath("$.discountAmount").value(75000)); // 10% of 750k -> SQA-BUG-02

        Product updated = productRepository.findById(boundaryOne.getId()).orElseThrow();
        assertThat(updated.getStock()).isEqualTo(0);
    }

    @Test
    void sqaBug03_customerCancelDoesNotRestoreStockWhileAdminCancelDoes() throws Exception {
        Product target = productRepository.findAll().stream()
                .filter(p -> p.getStock() >= 10)
                .findFirst()
                .orElseThrow();
        int initialStock = target.getStock();

        // Customer places order for 2 units
        String orderBody = objectMapper.writeValueAsString(Map.of(
                "customerName", "Khách Hủy Đơn",
                "customerPhone", "0977111222",
                "customerAddress", "Quận 1, TP.HCM",
                "items", List.of(Map.of("productId", target.getId(), "quantity", 2))
        ));

        MvcResult createRes = mockMvc.perform(post("/api/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(orderBody))
                .andExpect(status().isCreated())
                .andReturn();

        Long orderId = objectMapper.readTree(createRes.getResponse().getContentAsString()).get("id").asLong();
        assertThat(productRepository.findById(target.getId()).orElseThrow().getStock())
                .isEqualTo(initialStock - 2);

        // Customer cancels -> status CANCELLED, stock NOT restored (SQA-BUG-03)
        mockMvc.perform(post("/api/orders/" + orderId + "/customer-cancel"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("CANCELLED"));

        assertThat(productRepository.findById(target.getId()).orElseThrow().getStock())
                .isEqualTo(initialStock - 2);

        // Admin cancels PENDING seeded order ORD-1003 -> stock IS properly restored
        var pendingOrder = orderRepository.findAll().stream()
                .filter(o -> o.getStatus() == OrderStatus.PENDING)
                .findFirst()
                .orElseThrow();
        Long seededProductId = pendingOrder.getItems().get(0).getProductId();
        int seededQty = pendingOrder.getItems().get(0).getQuantity();
        int stockBeforeAdminCancel = productRepository.findById(seededProductId).orElseThrow().getStock();

        mockMvc.perform(patch("/api/orders/" + pendingOrder.getId() + "/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\":\"CANCELLED\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("CANCELLED"));

        assertThat(productRepository.findById(seededProductId).orElseThrow().getStock())
                .isEqualTo(stockBeforeAdminCancel + seededQty);
    }

    @Test
    void sqaBug04_orderLookupLeaksAllOrdersOnEmptyOrSpecialChars() throws Exception {
        // Valid phone returns only matching customer's orders
        MvcResult exactRes = mockMvc.perform(get("/api/orders/lookup").param("phone", "0901234567"))
                .andExpect(status().isOk())
                .andReturn();
        JsonNode exactArray = objectMapper.readTree(exactRes.getResponse().getContentAsString());
        assertThat(exactArray.size()).isEqualTo(1);
        assertThat(exactArray.get(0).get("customerPhone").asText()).isEqualTo("0901234567");

        // Empty phone exposes ALL 4 orders (SQA-BUG-04)
        MvcResult emptyRes = mockMvc.perform(get("/api/orders/lookup").param("phone", ""))
                .andExpect(status().isOk())
                .andReturn();
        assertThat(objectMapper.readTree(emptyRes.getResponse().getContentAsString()).size()).isEqualTo(4);

        // Special characters expose ALL 4 orders (SQA-BUG-04)
        MvcResult specialRes = mockMvc.perform(get("/api/orders/lookup").param("phone", "@#$%"))
                .andExpect(status().isOk())
                .andReturn();
        assertThat(objectMapper.readTree(specialRes.getResponse().getContentAsString()).size()).isEqualTo(4);
    }
}
