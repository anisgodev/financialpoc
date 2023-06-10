package com.bnppf.alphacredit.creditproductdesigner.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.is;

import com.bnppf.alphacredit.creditproductdesigner.IntegrationTest;
import com.bnppf.alphacredit.creditproductdesigner.domain.BusinessRuleCondition;
import com.bnppf.alphacredit.creditproductdesigner.domain.enumeration.OperatorEnum;
import com.bnppf.alphacredit.creditproductdesigner.repository.BusinessRuleConditionRepository;
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
 * Integration tests for the {@link BusinessRuleConditionResource} REST controller.
 */
@IntegrationTest
@AutoConfigureWebTestClient(timeout = IntegrationTest.DEFAULT_ENTITY_TIMEOUT)
@WithMockUser
class BusinessRuleConditionResourceIT {

    private static final String DEFAULT_FIELD = "AAAAAAAAAA";
    private static final String UPDATED_FIELD = "BBBBBBBBBB";

    private static final String DEFAULT_VALUE = "AAAAAAAAAA";
    private static final String UPDATED_VALUE = "BBBBBBBBBB";

    private static final OperatorEnum DEFAULT_OPERATOR = OperatorEnum.NOT_EQUAL_TO;
    private static final OperatorEnum UPDATED_OPERATOR = OperatorEnum.EQUAL_TO;

    private static final String ENTITY_API_URL = "/api/business-rule-conditions";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private BusinessRuleConditionRepository businessRuleConditionRepository;

    @Autowired
    private WebTestClient webTestClient;

    private BusinessRuleCondition businessRuleCondition;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static BusinessRuleCondition createEntity() {
        BusinessRuleCondition businessRuleCondition = new BusinessRuleCondition()
            .field(DEFAULT_FIELD)
            .value(DEFAULT_VALUE)
            .operator(DEFAULT_OPERATOR);
        return businessRuleCondition;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static BusinessRuleCondition createUpdatedEntity() {
        BusinessRuleCondition businessRuleCondition = new BusinessRuleCondition()
            .field(UPDATED_FIELD)
            .value(UPDATED_VALUE)
            .operator(UPDATED_OPERATOR);
        return businessRuleCondition;
    }

    @BeforeEach
    public void initTest() {
        businessRuleConditionRepository.deleteAll().block();
        businessRuleCondition = createEntity();
    }

    @Test
    void createBusinessRuleCondition() throws Exception {
        int databaseSizeBeforeCreate = businessRuleConditionRepository.findAll().collectList().block().size();
        // Create the BusinessRuleCondition
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(businessRuleCondition))
            .exchange()
            .expectStatus()
            .isCreated();

        // Validate the BusinessRuleCondition in the database
        List<BusinessRuleCondition> businessRuleConditionList = businessRuleConditionRepository.findAll().collectList().block();
        assertThat(businessRuleConditionList).hasSize(databaseSizeBeforeCreate + 1);
        BusinessRuleCondition testBusinessRuleCondition = businessRuleConditionList.get(businessRuleConditionList.size() - 1);
        assertThat(testBusinessRuleCondition.getField()).isEqualTo(DEFAULT_FIELD);
        assertThat(testBusinessRuleCondition.getValue()).isEqualTo(DEFAULT_VALUE);
        assertThat(testBusinessRuleCondition.getOperator()).isEqualTo(DEFAULT_OPERATOR);
    }

    @Test
    void createBusinessRuleConditionWithExistingId() throws Exception {
        // Create the BusinessRuleCondition with an existing ID
        businessRuleCondition.setId("existing_id");

        int databaseSizeBeforeCreate = businessRuleConditionRepository.findAll().collectList().block().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(businessRuleCondition))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the BusinessRuleCondition in the database
        List<BusinessRuleCondition> businessRuleConditionList = businessRuleConditionRepository.findAll().collectList().block();
        assertThat(businessRuleConditionList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void checkFieldIsRequired() throws Exception {
        int databaseSizeBeforeTest = businessRuleConditionRepository.findAll().collectList().block().size();
        // set the field null
        businessRuleCondition.setField(null);

        // Create the BusinessRuleCondition, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(businessRuleCondition))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<BusinessRuleCondition> businessRuleConditionList = businessRuleConditionRepository.findAll().collectList().block();
        assertThat(businessRuleConditionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkValueIsRequired() throws Exception {
        int databaseSizeBeforeTest = businessRuleConditionRepository.findAll().collectList().block().size();
        // set the field null
        businessRuleCondition.setValue(null);

        // Create the BusinessRuleCondition, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(businessRuleCondition))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<BusinessRuleCondition> businessRuleConditionList = businessRuleConditionRepository.findAll().collectList().block();
        assertThat(businessRuleConditionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkOperatorIsRequired() throws Exception {
        int databaseSizeBeforeTest = businessRuleConditionRepository.findAll().collectList().block().size();
        // set the field null
        businessRuleCondition.setOperator(null);

        // Create the BusinessRuleCondition, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(businessRuleCondition))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<BusinessRuleCondition> businessRuleConditionList = businessRuleConditionRepository.findAll().collectList().block();
        assertThat(businessRuleConditionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void getAllBusinessRuleConditionsAsStream() {
        // Initialize the database
        businessRuleConditionRepository.save(businessRuleCondition).block();

        List<BusinessRuleCondition> businessRuleConditionList = webTestClient
            .get()
            .uri(ENTITY_API_URL)
            .accept(MediaType.APPLICATION_NDJSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentTypeCompatibleWith(MediaType.APPLICATION_NDJSON)
            .returnResult(BusinessRuleCondition.class)
            .getResponseBody()
            .filter(businessRuleCondition::equals)
            .collectList()
            .block(Duration.ofSeconds(5));

        assertThat(businessRuleConditionList).isNotNull();
        assertThat(businessRuleConditionList).hasSize(1);
        BusinessRuleCondition testBusinessRuleCondition = businessRuleConditionList.get(0);
        assertThat(testBusinessRuleCondition.getField()).isEqualTo(DEFAULT_FIELD);
        assertThat(testBusinessRuleCondition.getValue()).isEqualTo(DEFAULT_VALUE);
        assertThat(testBusinessRuleCondition.getOperator()).isEqualTo(DEFAULT_OPERATOR);
    }

    @Test
    void getAllBusinessRuleConditions() {
        // Initialize the database
        businessRuleConditionRepository.save(businessRuleCondition).block();

        // Get all the businessRuleConditionList
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
            .value(hasItem(businessRuleCondition.getId()))
            .jsonPath("$.[*].field")
            .value(hasItem(DEFAULT_FIELD))
            .jsonPath("$.[*].value")
            .value(hasItem(DEFAULT_VALUE))
            .jsonPath("$.[*].operator")
            .value(hasItem(DEFAULT_OPERATOR.toString()));
    }

    @Test
    void getBusinessRuleCondition() {
        // Initialize the database
        businessRuleConditionRepository.save(businessRuleCondition).block();

        // Get the businessRuleCondition
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, businessRuleCondition.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.id")
            .value(is(businessRuleCondition.getId()))
            .jsonPath("$.field")
            .value(is(DEFAULT_FIELD))
            .jsonPath("$.value")
            .value(is(DEFAULT_VALUE))
            .jsonPath("$.operator")
            .value(is(DEFAULT_OPERATOR.toString()));
    }

    @Test
    void getNonExistingBusinessRuleCondition() {
        // Get the businessRuleCondition
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, Long.MAX_VALUE)
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNotFound();
    }

    @Test
    void putExistingBusinessRuleCondition() throws Exception {
        // Initialize the database
        businessRuleConditionRepository.save(businessRuleCondition).block();

        int databaseSizeBeforeUpdate = businessRuleConditionRepository.findAll().collectList().block().size();

        // Update the businessRuleCondition
        BusinessRuleCondition updatedBusinessRuleCondition = businessRuleConditionRepository
            .findById(businessRuleCondition.getId())
            .block();
        updatedBusinessRuleCondition.field(UPDATED_FIELD).value(UPDATED_VALUE).operator(UPDATED_OPERATOR);

        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, updatedBusinessRuleCondition.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(updatedBusinessRuleCondition))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the BusinessRuleCondition in the database
        List<BusinessRuleCondition> businessRuleConditionList = businessRuleConditionRepository.findAll().collectList().block();
        assertThat(businessRuleConditionList).hasSize(databaseSizeBeforeUpdate);
        BusinessRuleCondition testBusinessRuleCondition = businessRuleConditionList.get(businessRuleConditionList.size() - 1);
        assertThat(testBusinessRuleCondition.getField()).isEqualTo(UPDATED_FIELD);
        assertThat(testBusinessRuleCondition.getValue()).isEqualTo(UPDATED_VALUE);
        assertThat(testBusinessRuleCondition.getOperator()).isEqualTo(UPDATED_OPERATOR);
    }

    @Test
    void putNonExistingBusinessRuleCondition() throws Exception {
        int databaseSizeBeforeUpdate = businessRuleConditionRepository.findAll().collectList().block().size();
        businessRuleCondition.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, businessRuleCondition.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(businessRuleCondition))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the BusinessRuleCondition in the database
        List<BusinessRuleCondition> businessRuleConditionList = businessRuleConditionRepository.findAll().collectList().block();
        assertThat(businessRuleConditionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchBusinessRuleCondition() throws Exception {
        int databaseSizeBeforeUpdate = businessRuleConditionRepository.findAll().collectList().block().size();
        businessRuleCondition.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, UUID.randomUUID().toString())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(businessRuleCondition))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the BusinessRuleCondition in the database
        List<BusinessRuleCondition> businessRuleConditionList = businessRuleConditionRepository.findAll().collectList().block();
        assertThat(businessRuleConditionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamBusinessRuleCondition() throws Exception {
        int databaseSizeBeforeUpdate = businessRuleConditionRepository.findAll().collectList().block().size();
        businessRuleCondition.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(businessRuleCondition))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the BusinessRuleCondition in the database
        List<BusinessRuleCondition> businessRuleConditionList = businessRuleConditionRepository.findAll().collectList().block();
        assertThat(businessRuleConditionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateBusinessRuleConditionWithPatch() throws Exception {
        // Initialize the database
        businessRuleConditionRepository.save(businessRuleCondition).block();

        int databaseSizeBeforeUpdate = businessRuleConditionRepository.findAll().collectList().block().size();

        // Update the businessRuleCondition using partial update
        BusinessRuleCondition partialUpdatedBusinessRuleCondition = new BusinessRuleCondition();
        partialUpdatedBusinessRuleCondition.setId(businessRuleCondition.getId());

        partialUpdatedBusinessRuleCondition.field(UPDATED_FIELD).operator(UPDATED_OPERATOR);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedBusinessRuleCondition.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedBusinessRuleCondition))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the BusinessRuleCondition in the database
        List<BusinessRuleCondition> businessRuleConditionList = businessRuleConditionRepository.findAll().collectList().block();
        assertThat(businessRuleConditionList).hasSize(databaseSizeBeforeUpdate);
        BusinessRuleCondition testBusinessRuleCondition = businessRuleConditionList.get(businessRuleConditionList.size() - 1);
        assertThat(testBusinessRuleCondition.getField()).isEqualTo(UPDATED_FIELD);
        assertThat(testBusinessRuleCondition.getValue()).isEqualTo(DEFAULT_VALUE);
        assertThat(testBusinessRuleCondition.getOperator()).isEqualTo(UPDATED_OPERATOR);
    }

    @Test
    void fullUpdateBusinessRuleConditionWithPatch() throws Exception {
        // Initialize the database
        businessRuleConditionRepository.save(businessRuleCondition).block();

        int databaseSizeBeforeUpdate = businessRuleConditionRepository.findAll().collectList().block().size();

        // Update the businessRuleCondition using partial update
        BusinessRuleCondition partialUpdatedBusinessRuleCondition = new BusinessRuleCondition();
        partialUpdatedBusinessRuleCondition.setId(businessRuleCondition.getId());

        partialUpdatedBusinessRuleCondition.field(UPDATED_FIELD).value(UPDATED_VALUE).operator(UPDATED_OPERATOR);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedBusinessRuleCondition.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedBusinessRuleCondition))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the BusinessRuleCondition in the database
        List<BusinessRuleCondition> businessRuleConditionList = businessRuleConditionRepository.findAll().collectList().block();
        assertThat(businessRuleConditionList).hasSize(databaseSizeBeforeUpdate);
        BusinessRuleCondition testBusinessRuleCondition = businessRuleConditionList.get(businessRuleConditionList.size() - 1);
        assertThat(testBusinessRuleCondition.getField()).isEqualTo(UPDATED_FIELD);
        assertThat(testBusinessRuleCondition.getValue()).isEqualTo(UPDATED_VALUE);
        assertThat(testBusinessRuleCondition.getOperator()).isEqualTo(UPDATED_OPERATOR);
    }

    @Test
    void patchNonExistingBusinessRuleCondition() throws Exception {
        int databaseSizeBeforeUpdate = businessRuleConditionRepository.findAll().collectList().block().size();
        businessRuleCondition.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, businessRuleCondition.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(businessRuleCondition))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the BusinessRuleCondition in the database
        List<BusinessRuleCondition> businessRuleConditionList = businessRuleConditionRepository.findAll().collectList().block();
        assertThat(businessRuleConditionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchBusinessRuleCondition() throws Exception {
        int databaseSizeBeforeUpdate = businessRuleConditionRepository.findAll().collectList().block().size();
        businessRuleCondition.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, UUID.randomUUID().toString())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(businessRuleCondition))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the BusinessRuleCondition in the database
        List<BusinessRuleCondition> businessRuleConditionList = businessRuleConditionRepository.findAll().collectList().block();
        assertThat(businessRuleConditionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamBusinessRuleCondition() throws Exception {
        int databaseSizeBeforeUpdate = businessRuleConditionRepository.findAll().collectList().block().size();
        businessRuleCondition.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(businessRuleCondition))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the BusinessRuleCondition in the database
        List<BusinessRuleCondition> businessRuleConditionList = businessRuleConditionRepository.findAll().collectList().block();
        assertThat(businessRuleConditionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteBusinessRuleCondition() {
        // Initialize the database
        businessRuleConditionRepository.save(businessRuleCondition).block();

        int databaseSizeBeforeDelete = businessRuleConditionRepository.findAll().collectList().block().size();

        // Delete the businessRuleCondition
        webTestClient
            .delete()
            .uri(ENTITY_API_URL_ID, businessRuleCondition.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        // Validate the database contains one less item
        List<BusinessRuleCondition> businessRuleConditionList = businessRuleConditionRepository.findAll().collectList().block();
        assertThat(businessRuleConditionList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
