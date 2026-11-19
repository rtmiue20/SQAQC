package com.aurastore.controller;

import com.aurastore.config.DataSeeder;
import com.aurastore.dto.SeedResetResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/seed")
public class SeedController {

    private final DataSeeder dataSeeder;

    public SeedController(DataSeeder dataSeeder) {
        this.dataSeeder = dataSeeder;
    }

    @PostMapping("/reset")
    public ResponseEntity<SeedResetResponse> resetSeedData() {
        return ResponseEntity.ok(dataSeeder.resetSeedData());
    }
}
