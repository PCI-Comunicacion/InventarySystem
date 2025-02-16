package api_inventaryPCI.Inventary.service;

public interface TokenRevocationService {

    void revokeToken(String token);

    boolean isTokenRevoked(String token);

    void clearRevokedTokens();
}
