package com.bnppf.alphacredit.creditproductdesigner.repository;

import com.bnppf.alphacredit.creditproductdesigner.domain.CreditProductInstance;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB reactive repository for the CreditProductInstance entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CreditProductInstanceRepository extends ReactiveMongoRepository<CreditProductInstance, String> {}
