package com.bnppf.alphacredit.creditproductdesigner.repository;

import com.bnppf.alphacredit.creditproductdesigner.domain.BusinessModel;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB reactive repository for the BusinessModel entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BusinessModelRepository extends ReactiveMongoRepository<BusinessModel, String> {}
