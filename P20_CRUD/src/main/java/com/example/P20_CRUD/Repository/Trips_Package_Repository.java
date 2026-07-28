package com.example.P20_CRUD.Repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.P20_CRUD.Entity.Trips_Package;

import jakarta.transaction.Transactional;



@Repository
public interface Trips_Package_Repository extends JpaRepository< Trips_Package, Integer> {

	//for delete package and keep delete packages info
	@Transactional
	@Modifying
	@Query("update Trips_Package set package_status=0 where packageid= :p_id")
	public int delet_epackage(@Param("p_id")int p_id);
	
	
	 @Query("SELECT t from  Trips_Package t where package_status=1 and t.company_id = (SELECT c.company_id FROM Company c WHERE c.user_id.user_id = :userid)")
	public List<Trips_Package> getallPackagesbyComid(@Param("userid")int userid);

	@Query("SELECT t from Trips_Package t  where packageid= :packageid")
	public Trips_Package findPackage(@Param("packageid")int packageid);

	@Modifying
	@Transactional
	@Query("update Trips_Package set package_name=:package_name, description=:description, source=:source, destination=:destination, person_per_package=:person_per_package, image_desc=:image_desc where packageid=:package_id")
	public int updatePack(
	    @Param("package_id") int package_id, 
	    @Param("package_name") String package_name, 
	    @Param("source") String source, 
	    @Param("image_desc") String image_desc, 
	    @Param("description") String description, 
	    @Param("person_per_package") float person_per_package, 
	    @Param("destination") String destination
	);

	@Query("SELECT t.packageid from  Trips_Package t where t.company_id = (SELECT c.company_id FROM Company c WHERE c.user_id.user_id = :userid)")
	public int[] getPackageid(@Param("userid")int userid);




	   
	   
}

