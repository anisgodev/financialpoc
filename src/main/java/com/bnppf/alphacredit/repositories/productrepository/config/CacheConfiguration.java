package com.bnppf.alphacredit.repositories.productrepository.config;

import java.time.Duration;
import org.ehcache.config.builders.*;
import org.ehcache.jsr107.Eh107Configuration;
import org.hibernate.cache.jcache.ConfigSettings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.cache.JCacheManagerCustomizer;
import org.springframework.boot.autoconfigure.orm.jpa.HibernatePropertiesCustomizer;
import org.springframework.boot.info.BuildProperties;
import org.springframework.boot.info.GitProperties;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.interceptor.KeyGenerator;
import org.springframework.context.annotation.*;
import tech.jhipster.config.JHipsterProperties;
import tech.jhipster.config.cache.PrefixedKeyGenerator;

@Configuration
@EnableCaching
public class CacheConfiguration {

    private GitProperties gitProperties;
    private BuildProperties buildProperties;
    private final javax.cache.configuration.Configuration<Object, Object> jcacheConfiguration;

    public CacheConfiguration(JHipsterProperties jHipsterProperties) {
        JHipsterProperties.Cache.Ehcache ehcache = jHipsterProperties.getCache().getEhcache();

        jcacheConfiguration =
            Eh107Configuration.fromEhcacheCacheConfiguration(
                CacheConfigurationBuilder
                    .newCacheConfigurationBuilder(Object.class, Object.class, ResourcePoolsBuilder.heap(ehcache.getMaxEntries()))
                    .withExpiry(ExpiryPolicyBuilder.timeToLiveExpiration(Duration.ofSeconds(ehcache.getTimeToLiveSeconds())))
                    .build()
            );
    }

    @Bean
    public HibernatePropertiesCustomizer hibernatePropertiesCustomizer(javax.cache.CacheManager cacheManager) {
        return hibernateProperties -> hibernateProperties.put(ConfigSettings.CACHE_MANAGER, cacheManager);
    }

    @Bean
    public JCacheManagerCustomizer cacheManagerCustomizer() {
        return cm -> {
            createCache(cm, com.bnppf.alphacredit.repositories.productrepository.repository.UserRepository.USERS_BY_LOGIN_CACHE);
            createCache(cm, com.bnppf.alphacredit.repositories.productrepository.repository.UserRepository.USERS_BY_EMAIL_CACHE);
            createCache(cm, com.bnppf.alphacredit.repositories.productrepository.domain.User.class.getName());
            createCache(cm, com.bnppf.alphacredit.repositories.productrepository.domain.Authority.class.getName());
            createCache(cm, com.bnppf.alphacredit.repositories.productrepository.domain.User.class.getName() + ".authorities");
            createCache(cm, com.bnppf.alphacredit.repositories.productrepository.domain.EligibilityCondition.class.getName());
            createCache(cm, com.bnppf.alphacredit.repositories.productrepository.domain.Condition.class.getName());
            createCache(
                cm,
                com.bnppf.alphacredit.repositories.productrepository.domain.Condition.class.getName() + ".eligibilityConditions"
            );
            createCache(cm, com.bnppf.alphacredit.repositories.productrepository.domain.ParameterDefType.class.getName());
            createCache(cm, com.bnppf.alphacredit.repositories.productrepository.domain.ParameterDefType.class.getName() + ".parameters");
            createCache(cm, com.bnppf.alphacredit.repositories.productrepository.domain.ExpectedValue.class.getName());
            createCache(cm, com.bnppf.alphacredit.repositories.productrepository.domain.ExpectedValue.class.getName() + ".parameters");
            createCache(cm, com.bnppf.alphacredit.repositories.productrepository.domain.Parameter.class.getName());
            createCache(cm, com.bnppf.alphacredit.repositories.productrepository.domain.Parameter.class.getName() + ".conditions");
            createCache(cm, com.bnppf.alphacredit.repositories.productrepository.domain.ItemFeature.class.getName());
            createCache(cm, com.bnppf.alphacredit.repositories.productrepository.domain.ItemFeature.class.getName() + ".parameters");
            createCache(
                cm,
                com.bnppf.alphacredit.repositories.productrepository.domain.ItemFeature.class.getName() + ".eligibilityConditions"
            );
            createCache(cm, com.bnppf.alphacredit.repositories.productrepository.domain.ProductItemType.class.getName());
            createCache(
                cm,
                com.bnppf.alphacredit.repositories.productrepository.domain.ProductItemType.class.getName() + ".productRepositoryItems"
            );
            createCache(cm, com.bnppf.alphacredit.repositories.productrepository.domain.ItemGroup.class.getName());
            createCache(
                cm,
                com.bnppf.alphacredit.repositories.productrepository.domain.ItemGroup.class.getName() + ".eligibilityConditions"
            );
            createCache(cm, com.bnppf.alphacredit.repositories.productrepository.domain.ProductRepositoryItem.class.getName());
            createCache(
                cm,
                com.bnppf.alphacredit.repositories.productrepository.domain.ProductRepositoryItem.class.getName() + ".eligibilityConditions"
            );
            createCache(
                cm,
                com.bnppf.alphacredit.repositories.productrepository.domain.ProductRepositoryItem.class.getName() + ".itemFeatures"
            );
            // jhipster-needle-ehcache-add-entry
        };
    }

    private void createCache(javax.cache.CacheManager cm, String cacheName) {
        javax.cache.Cache<Object, Object> cache = cm.getCache(cacheName);
        if (cache != null) {
            cache.clear();
        } else {
            cm.createCache(cacheName, jcacheConfiguration);
        }
    }

    @Autowired(required = false)
    public void setGitProperties(GitProperties gitProperties) {
        this.gitProperties = gitProperties;
    }

    @Autowired(required = false)
    public void setBuildProperties(BuildProperties buildProperties) {
        this.buildProperties = buildProperties;
    }

    @Bean
    public KeyGenerator keyGenerator() {
        return new PrefixedKeyGenerator(this.gitProperties, this.buildProperties);
    }
}
