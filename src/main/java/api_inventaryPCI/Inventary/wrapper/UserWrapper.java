package api_inventaryPCI.Inventary.wrapper;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserWrapper {

    private Integer id;
    private String name;
    private String email;
    private String status;
    private String position;
    private String role;

}
