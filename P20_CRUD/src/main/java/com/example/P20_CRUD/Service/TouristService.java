package com.example.P20_CRUD.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.P20_CRUD.Entity.Tourist;
import com.example.P20_CRUD.Repository.TouristRepository;

import java.util.List;

@Service
public class TouristService {

    private final TouristRepository touristRepository;

    @Autowired
    public TouristService(TouristRepository touristRepository) {
        this.touristRepository = touristRepository;
    }

    /**
     * Saves multiple tourists.
     * 
     * @param tourists List of tourists to save.
     * @return List of saved tourists.
     */
    @Transactional
    public List<Tourist> saveMultipleTourists(List<Tourist> tourists) {
        return touristRepository.saveAll(tourists);
    }
}
