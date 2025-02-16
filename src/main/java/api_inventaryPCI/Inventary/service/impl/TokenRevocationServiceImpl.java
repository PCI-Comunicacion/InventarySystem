package api_inventaryPCI.Inventary.service.impl;

import api_inventaryPCI.Inventary.service.TokenRevocationService;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
public class TokenRevocationServiceImpl implements TokenRevocationService {

    private final Set<String> revokedTokens = new HashSet<>();

    @Override
    public void revokeToken(String token) {
        revokedTokens.add(token);
    }

    @Override
    public boolean isTokenRevoked(String token) {
        return revokedTokens.contains(token);
    }

    @Override
    public void clearRevokedTokens() {
        revokedTokens.clear();
    }
}
