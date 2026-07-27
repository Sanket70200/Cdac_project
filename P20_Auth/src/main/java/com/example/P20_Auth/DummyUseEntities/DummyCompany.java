package com.example.P20_Auth.DummyUseEntities;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class DummyCompany {

	private String Company_name;
	private String Companyreg_no;
    private String username;
	
	private String password;
	
	private String contactno;
	
	private String email;
	
	private String address;
}

