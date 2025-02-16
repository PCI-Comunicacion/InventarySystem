package api_inventaryPCI.Inventary.service.impl;

import api_inventaryPCI.Inventary.constantes.FacturaConstantes;
import api_inventaryPCI.Inventary.dao.UserDAO;
import api_inventaryPCI.Inventary.pojo.User;
import api_inventaryPCI.Inventary.security.CustomerDetailService;
import api_inventaryPCI.Inventary.security.jwt.JwtFilter;
import api_inventaryPCI.Inventary.security.jwt.JwtUtil;
import api_inventaryPCI.Inventary.service.UserService;
import api_inventaryPCI.Inventary.util.ApiResponse;
import api_inventaryPCI.Inventary.util.EmailUtils;
import api_inventaryPCI.Inventary.util.ResponseBuilder;
import api_inventaryPCI.Inventary.wrapper.UserWrapper;
import com.google.common.base.Strings;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;

import java.util.*;

@Slf4j
@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserDAO userDAO;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private CustomerDetailService customerDetailService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private EmailUtils emailUtils;

    @Autowired
    private JwtFilter jwtFilter;

    @Override
    public ResponseEntity<ApiResponse> signUp(Map<String, String> requestMap) {
        try {
            if (!jwtFilter.isAdmin()) {
                return ResponseBuilder.build("error", HttpStatus.FORBIDDEN.value(), FacturaConstantes.UNAUTHORIZED_ACTION, Map.of("role: ", requestMap.get("role")), "UNAUTHORIZED ACTION FOR THIS USER");
            } else {
                if (!validateSignUpMap(requestMap)) {
                    return ResponseBuilder.build("error", HttpStatus.BAD_REQUEST.value(), FacturaConstantes.INVALID_DATA, null, "INVALID DATA TO SIGN UP");
                } else {
                    if (isEmailRegistered(requestMap.get("email"))) {
                        return ResponseBuilder.build("error", HttpStatus.CONFLICT.value(), FacturaConstantes.USER_ALREADY_EXISTS, null, "EMAIL ALREADY REGISTERED");
                    } else {
                        User user = userDAO.save(getUserFromMap(requestMap, false));
                        return ResponseBuilder.build("success", HttpStatus.OK.value(), FacturaConstantes.USER_ADDED, Map.of("user", user), null);
                    }
                }
            }
        } catch (Exception e) {
            log.error("Error: {}", e);
            return ResponseBuilder.build("error", HttpStatus.INTERNAL_SERVER_ERROR.value(), FacturaConstantes.SOMETHING_WENT_WRONG, null, e.getMessage());
        }
    }

    @Override
    public ResponseEntity<ApiResponse> login(Map<String, String> requestMap) {
        try {
            if(!isEmailRegistered(requestMap.get("email"))) {
                return ResponseBuilder.build("error", HttpStatus.BAD_REQUEST.value(), FacturaConstantes.USER_NOT_FOUND, null, "USER NOT FOUND");
            } else {
                try {
                    Authentication authentication = authenticationManager.authenticate( new UsernamePasswordAuthenticationToken(requestMap.get("email"), requestMap.get("password")));
                    if (authentication.isAuthenticated()) {
                        if (customerDetailService.getUserDetail().getStatus().equalsIgnoreCase("true")) {
                            return ResponseBuilder.build("success", HttpStatus.OK.value(), FacturaConstantes.USER_LOGGED_IN, Map.of("token", jwtUtil.generateToken(customerDetailService.getUserDetail().getEmail(), customerDetailService.getUserDetail().getRole())), null);
                        } else {
                            return ResponseBuilder.build("error", HttpStatus.BAD_REQUEST.value(), FacturaConstantes.USER_PENDING, null, "USER IS NOT APPROVED YET");
                        }
                    } else {
                        return ResponseBuilder.build("error", HttpStatus.BAD_REQUEST.value(), FacturaConstantes.USER_PASSWORD_ERROR, null, "INCORRECT PASSWORD");
                    }
                } catch (AuthenticationException e) {
                    return ResponseBuilder.build("error", HttpStatus.BAD_REQUEST.value(), FacturaConstantes.USER_PASSWORD_ERROR, null, e.getMessage());
                }
            }
        } catch (Exception e) {
            log.error("Error: {}", e);
            return ResponseBuilder.build("error", HttpStatus.INTERNAL_SERVER_ERROR.value(), FacturaConstantes.SOMETHING_WENT_WRONG, null, e.getMessage());
        }
    }

    @Override
    public ResponseEntity<ApiResponse> getAllUsers() {
        try {
            if (jwtFilter.isAdmin()) {
                List<UserWrapper> user = userDAO.getAllUsers();
                return ResponseBuilder.build("success", HttpStatus.OK.value(), FacturaConstantes.USER_LIST, Map.of("users", user), null);
            }
            else {
                return ResponseBuilder.build("error", HttpStatus.UNAUTHORIZED.value(), FacturaConstantes.UNAUTHORIZED_ACCESS, null, "DON'T HAVE PERMISSION TO ACCESS");
            }
        } catch (Exception e) {
            log.info("Error: {}", e.getMessage());
            return ResponseBuilder.build("error", HttpStatus.INTERNAL_SERVER_ERROR.value(), FacturaConstantes.SOMETHING_WENT_WRONG, null, e.getMessage());
        }
    }

    @Override
    public ResponseEntity<ApiResponse> updateStatus(Map<String, String> requestMap) {
        try {
            if (jwtFilter.isAdmin()) {
                Optional<User> optionalUser = userDAO.findById(Integer.parseInt(requestMap.get("id")));
                if (!optionalUser.isEmpty()) {
                    userDAO.updateStatus(requestMap.get("status"), Integer.parseInt(requestMap.get("id")));
                    sendEmailToAdmins(requestMap.get("status"), optionalUser.get().getEmail(), userDAO.getAllAdmins());
                    return ResponseBuilder.build("success", HttpStatus.OK.value(), FacturaConstantes.USER_STATUS_UPDATED, Map.of( "status", requestMap.get("status")), null);
                } else {
                    return ResponseBuilder.build("error", HttpStatus.NOT_FOUND.value(), FacturaConstantes.USER_NOT_FOUND, null, "USER NOT FOUND");
                }
            } else {
                return ResponseBuilder.build("error", HttpStatus.UNAUTHORIZED.value(), FacturaConstantes.UNAUTHORIZED_ACCESS, null, "DON'T HAVE PERMISSION TO ACCESS");
            }
        } catch (Exception e) {
            return ResponseBuilder.build("error", HttpStatus.INTERNAL_SERVER_ERROR.value(), FacturaConstantes.SOMETHING_WENT_WRONG, null, e.getMessage());
        }
    }

    @Override
    public ResponseEntity<ApiResponse> updateUser(Map<String, String> requestMap) {
        try {
            if (!jwtFilter.isAdmin()) {
                return ResponseBuilder.build("error", HttpStatus.FORBIDDEN.value(), FacturaConstantes.UNAUTHORIZED_ACTION, Map.of("role: ", requestMap.get("role")), "No tienes permiso para realizar esta acción");
            } else {
                Optional<User> userOptional = userDAO.findById(Integer.parseInt(requestMap.get("id")));
                if (validateUserMap(requestMap, true)) {
                    if (!userOptional.isEmpty()) {
                        User user = getUserFromMap(requestMap, true);
                        User userSaved = userDAO.save(user);
                        return ResponseBuilder.build("success", HttpStatus.OK.value(), FacturaConstantes.USER_UPDATED, Map.of("user", userSaved), null);
                    } else {
                        return ResponseBuilder.build("error", HttpStatus.NOT_FOUND.value(), FacturaConstantes.USER_NOT_FOUND, null, "ERROR TO UPDATE USER");
                    }
                } else {
                    return ResponseBuilder.build("error", HttpStatus.BAD_REQUEST.value(), FacturaConstantes.INVALID_DATA, null, "INVALID DATA TO UPDATE USER");
                }
            }
        } catch (Exception e) {
            log.error("Error: {}", e);
            return ResponseBuilder.build("error", HttpStatus.INTERNAL_SERVER_ERROR.value(), FacturaConstantes.SOMETHING_WENT_WRONG, null, e.getMessage());
        }
    }

    @Override
    public ResponseEntity<ApiResponse> deleteUser(Integer id) {
        try {
            if (jwtFilter.isAdmin()) {
                Optional userOptional = userDAO.findById(id);
                if (!userOptional.isEmpty()) {
                    userDAO.deleteById(id);
                    return ResponseBuilder.build("success", HttpStatus.OK.value(), FacturaConstantes.USER_DELETE, null, null);
                } else {
                    return ResponseBuilder.build("error", HttpStatus.NOT_FOUND.value(), FacturaConstantes.USER_NOT_FOUND, null, "USER NOT FOUND");
                }
            } else {
                return ResponseBuilder.build("error", HttpStatus.UNAUTHORIZED.value(), FacturaConstantes.UNAUTHORIZED_ACCESS, null, "DON'T HAVE PERMISSION TO ACCESS");
            }
        } catch (Exception e) {
            log.error("Error: {}", e);
            return ResponseBuilder.build("error", HttpStatus.INTERNAL_SERVER_ERROR.value(), FacturaConstantes.SOMETHING_WENT_WRONG, null, e.getMessage());
        }
    }

    @Override
    public ResponseEntity<ApiResponse> checkToken() {
        try {
            return ResponseBuilder.build("success", HttpStatus.OK.value(), "INVALID TOKEN", null, null);
        } catch (Exception e) {
            log.error("Error: {}", e);
            return ResponseBuilder.build("error", HttpStatus.INTERNAL_SERVER_ERROR.value(), FacturaConstantes.SOMETHING_WENT_WRONG, null, e.getMessage());
        }
    }

    @Override
    public ResponseEntity<ApiResponse> getUserByEmail(String email) {
        try {
            UserWrapper userWrapper = userDAO.findUserWrapperByEmail(email);
            if (Objects.nonNull(userWrapper)) {
                return ResponseBuilder.build("success", HttpStatus.OK.value(), FacturaConstantes.USER_FOUND, Map.of("user", userWrapper), null);
            } else {
                return ResponseBuilder.build("error", HttpStatus.NOT_FOUND.value(), FacturaConstantes.USER_NOT_FOUND, null, null);
            }
        } catch (Exception e) {
            log.error("Error: {}", e);
            return ResponseBuilder.build("error", HttpStatus.INTERNAL_SERVER_ERROR.value(), FacturaConstantes.SOMETHING_WENT_WRONG, null, e.getMessage());
        }
    }

    @Override
    public ResponseEntity<ApiResponse> changePassword(Map<String, String> requestMap) {
        try {
            User user = userDAO.findByEmail(jwtFilter.getCurrentUser());
            if (!user.equals(null)) {
                if (user.getPassword().equals(requestMap.get("oldPassword"))) {
                    user.setPassword(requestMap.get("newPassword"));
                    userDAO.save(user);
                    return ResponseBuilder.build("success", HttpStatus.OK.value(), "PASSWORD SUCCESSFULLY UPDATED", null, null);
                } else {
                    return ResponseBuilder.build("error", HttpStatus.BAD_REQUEST.value(), FacturaConstantes.USER_PASSWORD_ERROR, null, "INCORRECT PASSWORD");
                }
            } else {
                return ResponseBuilder.build("error", HttpStatus.NOT_FOUND.value(), FacturaConstantes.USER_NOT_FOUND, null, "UER NOT FOUND");
            }
        } catch (Exception e) {
            log.error("Error: {}", e);
            return ResponseBuilder.build("error", HttpStatus.INTERNAL_SERVER_ERROR.value(), FacturaConstantes.SOMETHING_WENT_WRONG, null, e.getMessage());
        }
    }

    @Override
    public ResponseEntity<ApiResponse> forgotPassword(Map<String, String> requestMap) {
        try {
            User user = userDAO.findByEmail(requestMap.get("email"));
            if (!Objects.isNull(user) && !Strings.isNullOrEmpty(user.getEmail())) {
                emailUtils.forgotPassword(user.getEmail(), "Recuperación de contraseña", user.getPassword());
                return ResponseBuilder.build("success", HttpStatus.OK.value(), "SENT EMAIL TO" + user.getEmail(), null, null);
            } else {
                return ResponseBuilder.build("error", HttpStatus.NOT_FOUND.value(), FacturaConstantes.USER_NOT_FOUND, null, "USER NOT FOUND");
            }
        } catch (Exception e) {
            log.error("Error: {}", e);
            return ResponseBuilder.build("error", HttpStatus.INTERNAL_SERVER_ERROR.value(), FacturaConstantes.SOMETHING_WENT_WRONG, null, e.getMessage());
        }
    }

    private boolean isEmailRegistered(String email) {
        User user = userDAO.findByEmail(email);
        return !Objects.isNull(user);
    }

    private boolean validateUserMap(Map<String, String> requestMap, boolean validateId) {
        if (requestMap.containsKey("email")) {
            if (requestMap.containsKey("id") && validateId) {
                return true;
            }
            if (!validateId) {
                return true;
            }
        }
        return false;
    }

    private boolean validateSignUpMap(Map<String, String> requestMap) {
        if (requestMap.containsKey("name") && requestMap.containsKey("position") && requestMap.containsKey("email") && requestMap.containsKey("password")) {
            return true;
        } else {
            return false;
        }
    }

    private User getUserFromMap(Map<String, String> requestMap, boolean validateId) {
        User user = new User();
        if (validateId) {
            user.setId(Integer.parseInt(requestMap.get("id")));
        }
        user.setName(requestMap.get("name"));
        user.setEmail(requestMap.get("email"));
        user.setPassword(requestMap.get("password"));
        user.setStatus(requestMap.get("status"));
        user.setPosition(requestMap.get("position"));
        user.setRole("user");
        return user;
    }

    private void sendEmailToAdmins(String status, String user, List<String> allAdmins) {
        allAdmins.remove(jwtFilter.getCurrentUser());
        if (status != null && status.equalsIgnoreCase("true")) {
            emailUtils.sendSimpleMessage(jwtFilter.getCurrentUser(), "ACCOUNT REJECTED", "THE ACCOUNT OF" + user + "HAS BEEN REJECT BY" + jwtFilter.getCurrentUser(), allAdmins);
        } else {
            emailUtils.sendSimpleMessage(jwtFilter.getCurrentUser(), "ACCOUNT REJECTED", "THE ACCOUNT OF" + user + "HAS BEEN REJECT BY" + jwtFilter.getCurrentUser(), allAdmins);
        }
    }
}
