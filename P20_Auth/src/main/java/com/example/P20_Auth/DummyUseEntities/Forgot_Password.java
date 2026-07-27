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
public class Forgot_Password {

	private String username;
	private String mobileno;
	private String email;
	private String password;
}
