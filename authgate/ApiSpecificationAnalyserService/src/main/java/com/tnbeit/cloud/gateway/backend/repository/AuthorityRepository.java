package com.tnbeit.cloud.gateway.backend.repository;

import com.tnbeit.cloud.gateway.backend.domain.Authority;
import org.springframework.data.mongodb.repository.MongoRepository;

/**
 * Spring Data MongoDB repository for the {@link Authority} entity.
 */
public interface AuthorityRepository extends MongoRepository<Authority, String> {}
