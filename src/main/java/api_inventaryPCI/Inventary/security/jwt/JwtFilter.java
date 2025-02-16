package api_inventaryPCI.Inventary.security.jwt;

import api_inventaryPCI.Inventary.security.CustomerDetailService;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CustomerDetailService customerDetailService;

    Claims claims = null;

    private String username = null;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String path = request.getServletPath();

        if (path.matches("/user/login|/user/forgotPassword|/user/getUserByEmail")) {
            filterChain.doFilter(request, response);
            log.info("Ruta pública sin autenticación: " + path);
            return;
        }else{

            log.info("PATH con auth: " + path);

            String authorizationHeader = request.getHeader("Authorization");
            String token = null;
            String username = null;

            log.info(authorizationHeader);

            if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
                token = authorizationHeader.substring(7);

                if (!token.isEmpty()) {


                    try {
                        username = jwtUtil.extractUsername(token);
                        claims = jwtUtil.extractAllClaims(token);
                        log.info("Token válido: " + claims + " USUARIO: " + username);
                    } catch (Exception e) {
                        log.error("Token inválido", e);
                        response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token inválido: " + e.getMessage());
                        return;
                    }
                } else {
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token vacío");
                    log.info("Token vacío");
                    return;
                }
            } else {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Authorization header is missing or doesn't start with Bearer");
                log.info("Authorization header is missing or doesn't start with Bearer");
                return;
            }

            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = customerDetailService.loadUserByUsername(username);

                if (jwtUtil.validateToken(token, userDetails)) {
                    UsernamePasswordAuthenticationToken authenticationToken =
                            new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

                    authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                } else {
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token validation failed");
                    log.info("Token validation failed");
                    return;
                }
            }
            filterChain.doFilter(request, response);
        }
    }

    public Boolean isAdmin(){
        return "admin".equalsIgnoreCase((String) claims.get("role"));
    }

    public Boolean isUser(){
        return "user".equalsIgnoreCase((String) claims.get("role"));
    }

    public String getCurrentUser(){
        return username;
    }
}
