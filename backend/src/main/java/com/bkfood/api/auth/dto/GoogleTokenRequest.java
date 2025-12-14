package com.bkfood.api.auth.dto;

import jakarta.validation.constraints.NotBlank;

public class GoogleTokenRequest {
    @NotBlank
    private String idToken;

    private String fullName;

    public String getIdToken() {
        return idToken;
    }

    public void setIdToken(String idToken) {
        this.idToken = idToken;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }
}
