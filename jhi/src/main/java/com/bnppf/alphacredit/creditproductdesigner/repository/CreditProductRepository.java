package com.bnppf.alphacredit.creditproductdesigner.repository;

import com.bnppf.alphacredit.creditproductdesigner.domain.CreditProduct;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB reactive repository for the CreditProduct entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CreditProductRepository extends ReactiveMongoRepository<CreditProduct, String> {}
