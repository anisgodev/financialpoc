package com.bnppf.alphacredit.creditproductdesigner.repository;

import com.bnppf.alphacredit.creditproductdesigner.domain.Simulation;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB reactive repository for the Simulation entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SimulationRepository extends ReactiveMongoRepository<Simulation, String> {}
