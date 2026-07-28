package com.example.P20_CRUD.Service;



import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.P20_CRUD.DummyUseEntities.AddPackages;
import com.example.P20_CRUD.Entity.Trips_Package;
import com.example.P20_CRUD.Repository.CompanyRepository;
import com.example.P20_CRUD.Repository.Trips_Package_Repository;

@Service
public class Trips_Package_Service {
	
	@Autowired
	Trips_Package_Repository TPRepo;
	
	@Autowired
	CompanyRepository comre;
	
	public List<Trips_Package> allPackages(int com)
	{
		return TPRepo.getallPackagesbyComid(com);
	}

	public int updatePakage(AddPackages upk)
	 {
		// TODO Auto-generated method stub
		return TPRepo.updatePack(upk.getPackage_id(),upk.getPackage_name(),upk.getSource(),upk.getImage_desc(),upk.getDescription(),upk.getPerson_per_package(),upk.getDestination());

	}


	public int deletePack(int packageid) {
		// TODO Auto-generated method stub
		return TPRepo.delet_epackage(packageid);
	}


	public String AddPackage(AddPackages ap) {
		// TODO Auto-generated method stub
		Trips_Package t1=new Trips_Package();
		t1.setCompany_id(comre.getByUserId(ap.getUserid()));
		t1.setDescription(ap.getDescription());
		t1.setDestination(ap.getDestination());
		t1.setPackage_name(ap.getPackage_name());
		t1.setSource(ap.getSource());
		t1.setImage_desc(ap.getImage_desc());
		t1.setPerson_per_package(ap.getPerson_per_package());
		t1.setPackage_status(1);
		
		TPRepo.save(t1);
		
		return "Package added successfully";
	}

}
