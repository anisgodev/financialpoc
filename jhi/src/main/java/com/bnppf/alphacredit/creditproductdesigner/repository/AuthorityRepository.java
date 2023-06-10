package com.bnppf.alphacredit.creditproductdesigner.repository;

import com.bnppf.alphacredit.creditproductdesigner.domain.Authority;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;

/**
 * Spring Data MongoDB repository for the {@link Authority} entity.
 */
public interface AuthorityRepository extends ReactiveMongoRepository<Authority, String> {}
