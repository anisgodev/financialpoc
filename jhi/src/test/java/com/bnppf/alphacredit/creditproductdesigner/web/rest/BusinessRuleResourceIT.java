package com.bnppf.alphacredit.creditproductdesigner.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.is;

import com.bnppf.alphacredit.creditproductdesigner.IntegrationTest;
import com.bnppf.alphacredit.creditproductdesigner.domain.BusinessRule;
import com.bnppf.alphacredit.creditproductdesigner.domain.enumeration.BusinessProcess;
import com.bnppf.alphacredit.creditproductdesigner.repository.BusinessRuleRepository;
import java.time.Duration;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.reactive.server.WebTestClient;

/**
 * Integration tests for the {@link BusinessRuleResource} REST controller.
 */
@IntegrationTest
@AutoConfigureWebTestClient(timeout = IntegrationTest.DEFAULT_ENTITY_TIMEOUT)
@WithMockUser
class BusinessRuleResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final BusinessProcess DEFAULT_BUSINESS_PROCESS = BusinessProcess.SCORING;
    private static final BusinessProcess UPDATED_BUSINESS_PROCESS = BusinessProcess.GRANTING;

    private static final String ENTITY_API_URL = "/api/business-rules";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private BusinessRuleRepository businessRuleRepository;

    @Autowired
    private WebTestClient webTestClient;

    private BusinessRule businessRule;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static BusinessRule createEntity() {
        BusinessRule businessRule = new BusinessRule().name(DEFAULT_NAME).businessProcess(DEFAULT_BUSINESS_PROCESS);
        return businessRule;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static BusinessRule createUpdatedEntity() {
        BusinessRule businessRule = new BusinessRule().name(UPDATED_NAME).businessProcess(UPDATED_BUSINESS_PROCESS);
        return businessRule;
    }

    @BeforeEach
    public void initTest() {
        businessRuleRepository.deleteAll().block();
        businessRule = createEntity();
    }

    @Test
    void createBusinessRule() throws Exception {
        int databaseSizeBeforeCreate = businessRuleRepository.findAll().collectList().block().size();
        // Create the BusinessRule
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(businessRule))
            .exchange()
            .expectStatus()
            .isCreated();

        // Validate the BusinessRule in the database
        List<BusinessRule> businessRuleList = businessRuleRepository.findAll().collectList().block();
        assertThat(businessRuleList).hasSize(databaseSizeBeforeCreate + 1);
        BusinessRule testBusinessRule = businessRuleList.get(businessRuleList.size() - 1);
        assertThat(testBusinessRule.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testBusinessRule.getBusinessProcess()).isEqualTo(DEFAULT_BUSINESS_PROCESS);
    }

    @Test
    void createBusinessRuleWithExistingId() throws Exception {
        // Create the BusinessRule with an existing ID
        businessRule.setId("existing_id");

        int databaseSizeBeforeCreate = businessRuleRepository.findAll().collectList().block().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(businessRule))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the BusinessRule in the database
        List<BusinessRule> businessRuleList = businessRuleRepository.findAll().collectList().block();
        assertThat(businessRuleList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = businessRuleRepository.findAll().collectList().block().size();
        // set the field null
        businessRule.setName(null);

        // Create the BusinessRule, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(businessRule))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<BusinessRule> businessRuleList = businessRuleRepository.findAll().collectList().block();
        assertThat(businessRuleList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkBusinessProcessIsRequired() throws Exception {
        int databaseSizeBeforeTest = businessRuleRepository.findAll().collectList().block().size();
        // set the field null
        businessRule.setBusinessProcess(null);

        // Create the BusinessRule, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(businessRule))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<BusinessRule> businessRuleList = businessRuleRepository.findAll().collectList().block();
        assertThat(businessRuleList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void getAllBusinessRulesAsStream() {
        // Initialize the database
        businessRuleRepository.save(businessRule).block();

        List<BusinessRule> businessRuleList = webTestClient
            .get()
            .uri(ENTITY_API_URL)
            .accept(MediaType.APPLICATION_NDJSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentTypeCompatibleWith(MediaType.APPLICATION_NDJSON)
            .returnResult(BusinessRule.class)
            .getResponseBody()
            .filter(businessRule::equals)
            .collectList()
            .block(Duration.ofSeconds(5));

        assertThat(businessRuleList).isNotNull();
        assertThat(businessRuleList).hasSize(1);
        BusinessRule testBusinessRule = businessRuleList.get(0);
        assertThat(testBusinessRule.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testBusinessRule.getBusinessProcess()).isEqualTo(DEFAULT_BUSINESS_PROCESS);
    }

    @Test
    void getAllBusinessRules() {
        // Initialize the database
        businessRuleRepository.save(businessRule).block();

        // Get all the businessRuleList
        webTestClient
            .get()
            .uri(ENTITY_API_URL + "?sort=id,desc")
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.[*].id")
            .value(hasItem(businessRule.getId()))
            .jsonPath("$.[*].name")
            .value(hasItem(DEFAULT_NAME))
            .jsonPath("$.[*].businessProcess")
            .value(hasItem(DEFAULT_BUSINESS_PROCESS.toString()));
    }

    @Test
    void getBusinessRule() {
        // Initialize the database
        businessRuleRepository.save(businessRule).block();

        // Get the businessRule
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, businessRule.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.id")
            .value(is(businessRule.getId()))
            .jsonPath("$.name")
            .value(is(DEFAULT_NAME))
            .jsonPath("$.businessProcess")
            .value(is(DEFAULT_BUSINESS_PROCESS.toString()));
    }

    @Test
    void getNonExistingBusinessRule() {
        // Get the businessRule
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, Long.MAX_VALUE)
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNotFound();
    }

    @Test
    void putExistingBusinessRule() throws Exception {
        // Initialize the database
        businessRuleRepository.save(businessRule).block();

        int databaseSizeBeforeUpdate = businessRuleRepository.findAll().collectList().block().size();

        // Update the businessRule
        BusinessRule updatedBusinessRule = businessRuleRepository.findById(businessRule.getId()).block();
        updatedBusinessRule.name(UPDATED_NAME).businessProcess(UPDATED_BUSINESS_PROCESS);

        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, updatedBusinessRule.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(updatedBusinessRule))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the BusinessRule in the database
        List<BusinessRule> businessRuleList = businessRuleRepository.findAll().collectList().block();
        assertThat(businessRuleList).hasSize(databaseSizeBeforeUpdate);
        BusinessRule testBusinessRule = businessRuleList.get(businessRuleList.size() - 1);
        assertThat(testBusinessRule.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testBusinessRule.getBusinessProcess()).isEqualTo(UPDATED_BUSINESS_PROCESS);
    }

    @Test
    void putNonExistingBusinessRule() throws Exception {
        int databaseSizeBeforeUpdate = businessRuleRepository.findAll().collectList().block().size();
        businessRule.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, businessRule.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(businessRule))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the BusinessRule in the database
        List<BusinessRule> businessRuleList = businessRuleRepository.findAll().collectList().block();
        assertThat(businessRuleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchBusinessRule() throws Exception {
        int databaseSizeBeforeUpdate = businessRuleRepository.findAll().collectList().block().size();
        businessRule.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, UUID.randomUUID().toString())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(businessRule))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the BusinessRule in the database
        List<BusinessRule> businessRuleList = businessRuleRepository.findAll().collectList().block();
        assertThat(businessRuleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamBusinessRule() throws Exception {
        int databaseSizeBeforeUpdate = businessRuleRepository.findAll().collectList().block().size();
        businessRule.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(businessRule))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the BusinessRule in the database
        List<BusinessRule> businessRuleList = businessRuleRepository.findAll().collectList().block();
        assertThat(businessRuleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateBusinessRuleWithPatch() throws Exception {
        // Initialize the database
        businessRuleRepository.save(businessRule).block();

        int databaseSizeBeforeUpdate = businessRuleRepository.findAll().collectList().block().size();

        // Update the businessRule using partial update
        BusinessRule partialUpdatedBusinessRule = new BusinessRule();
        partialUpdatedBusinessRule.setId(businessRule.getId());

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedBusinessRule.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedBusinessRule))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the BusinessRule in the database
        List<BusinessRule> businessRuleList = businessRuleRepository.findAll().collectList().block();
        assertThat(businessRuleList).hasSize(databaseSizeBeforeUpdate);
        BusinessRule testBusinessRule = businessRuleList.get(businessRuleList.size() - 1);
        assertThat(testBusinessRule.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testBusinessRule.getBusinessProcess()).isEqualTo(DEFAULT_BUSINESS_PROCESS);
    }

    @Test
    void fullUpdateBusinessRuleWithPatch() throws Exception {
        // Initialize the database
        businessRuleRepository.save(businessRule).block();

        int databaseSizeBeforeUpdate = businessRuleRepository.findAll().collectList().block().size();

        // Update the businessRule using partial update
        BusinessRule partialUpdatedBusinessRule = new BusinessRule();
        partialUpdatedBusinessRule.setId(businessRule.getId());

        partialUpdatedBusinessRule.name(UPDATED_NAME).businessProcess(UPDATED_BUSINESS_PROCESS);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedBusinessRule.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedBusinessRule))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the BusinessRule in the database
        List<BusinessRule> businessRuleList = businessRuleRepository.findAll().collectList().block();
        assertThat(businessRuleList).hasSize(databaseSizeBeforeUpdate);
        BusinessRule testBusinessRule = businessRuleList.get(businessRuleList.size() - 1);
        assertThat(testBusinessRule.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testBusinessRule.getBusinessProcess()).isEqualTo(UPDATED_BUSINESS_PROCESS);
    }

    @Test
    void patchNonExistingBusinessRule() throws Exception {
        int databaseSizeBeforeUpdate = businessRuleRepository.findAll().collectList().block().size();
        businessRule.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, businessRule.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(businessRule))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the BusinessRule in the database
        List<BusinessRule> businessRuleList = businessRuleRepository.findAll().collectList().block();
        assertThat(businessRuleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchBusinessRule() throws Exception {
        int databaseSizeBeforeUpdate = businessRuleRepository.findAll().collectList().block().size();
        businessRule.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, UUID.randomUUID().toString())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(businessRule))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the BusinessRule in the database
        List<BusinessRule> businessRuleList = businessRuleRepository.findAll().collectList().block();
        assertThat(businessRuleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamBusinessRule() throws Exception {
        int databaseSizeBeforeUpdate = businessRuleRepository.findAll().collectList().block().size();
        businessRule.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(businessRule))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the BusinessRule in the database
        List<BusinessRule> businessRuleList = businessRuleRepository.findAll().collectList().block();
        assertThat(businessRuleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteBusinessRule() {
        // Initialize the database
        businessRuleRepository.save(businessRule).block();

        int databaseSizeBeforeDelete = businessRuleRepository.findAll().collectList().block().size();

        // Delete the businessRule
        webTestClient
            .delete()
            .uri(ENTITY_API_URL_ID, businessRule.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        // Validate the database contains one less item
        List<BusinessRule> businessRuleList = businessRuleRepository.findAll().collectList().block();
        assertThat(businessRuleList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
