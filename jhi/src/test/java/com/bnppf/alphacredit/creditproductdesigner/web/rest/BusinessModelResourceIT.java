package com.bnppf.alphacredit.creditproductdesigner.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.is;

import com.bnppf.alphacredit.creditproductdesigner.IntegrationTest;
import com.bnppf.alphacredit.creditproductdesigner.domain.BusinessModel;
import com.bnppf.alphacredit.creditproductdesigner.domain.enumeration.BusinessProcess;
import com.bnppf.alphacredit.creditproductdesigner.domain.enumeration.ParameterType;
import com.bnppf.alphacredit.creditproductdesigner.repository.BusinessModelRepository;
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
 * Integration tests for the {@link BusinessModelResource} REST controller.
 */
@IntegrationTest
@AutoConfigureWebTestClient(timeout = IntegrationTest.DEFAULT_ENTITY_TIMEOUT)
@WithMockUser
class BusinessModelResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final ParameterType DEFAULT_TYPE = ParameterType.CREDIT_PRODUCT;
    private static final ParameterType UPDATED_TYPE = ParameterType.BOOLEAN;

    private static final BusinessProcess DEFAULT_CATEGORY = BusinessProcess.SCORING;
    private static final BusinessProcess UPDATED_CATEGORY = BusinessProcess.GRANTING;

    private static final String ENTITY_API_URL = "/api/business-models";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private BusinessModelRepository businessModelRepository;

    @Autowired
    private WebTestClient webTestClient;

    private BusinessModel businessModel;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static BusinessModel createEntity() {
        BusinessModel businessModel = new BusinessModel().name(DEFAULT_NAME).type(DEFAULT_TYPE).category(DEFAULT_CATEGORY);
        return businessModel;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static BusinessModel createUpdatedEntity() {
        BusinessModel businessModel = new BusinessModel().name(UPDATED_NAME).type(UPDATED_TYPE).category(UPDATED_CATEGORY);
        return businessModel;
    }

    @BeforeEach
    public void initTest() {
        businessModelRepository.deleteAll().block();
        businessModel = createEntity();
    }

    @Test
    void createBusinessModel() throws Exception {
        int databaseSizeBeforeCreate = businessModelRepository.findAll().collectList().block().size();
        // Create the BusinessModel
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(businessModel))
            .exchange()
            .expectStatus()
            .isCreated();

        // Validate the BusinessModel in the database
        List<BusinessModel> businessModelList = businessModelRepository.findAll().collectList().block();
        assertThat(businessModelList).hasSize(databaseSizeBeforeCreate + 1);
        BusinessModel testBusinessModel = businessModelList.get(businessModelList.size() - 1);
        assertThat(testBusinessModel.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testBusinessModel.getType()).isEqualTo(DEFAULT_TYPE);
        assertThat(testBusinessModel.getCategory()).isEqualTo(DEFAULT_CATEGORY);
    }

    @Test
    void createBusinessModelWithExistingId() throws Exception {
        // Create the BusinessModel with an existing ID
        businessModel.setId("existing_id");

        int databaseSizeBeforeCreate = businessModelRepository.findAll().collectList().block().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(businessModel))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the BusinessModel in the database
        List<BusinessModel> businessModelList = businessModelRepository.findAll().collectList().block();
        assertThat(businessModelList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = businessModelRepository.findAll().collectList().block().size();
        // set the field null
        businessModel.setName(null);

        // Create the BusinessModel, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(businessModel))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<BusinessModel> businessModelList = businessModelRepository.findAll().collectList().block();
        assertThat(businessModelList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkTypeIsRequired() throws Exception {
        int databaseSizeBeforeTest = businessModelRepository.findAll().collectList().block().size();
        // set the field null
        businessModel.setType(null);

        // Create the BusinessModel, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(businessModel))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<BusinessModel> businessModelList = businessModelRepository.findAll().collectList().block();
        assertThat(businessModelList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkCategoryIsRequired() throws Exception {
        int databaseSizeBeforeTest = businessModelRepository.findAll().collectList().block().size();
        // set the field null
        businessModel.setCategory(null);

        // Create the BusinessModel, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(businessModel))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<BusinessModel> businessModelList = businessModelRepository.findAll().collectList().block();
        assertThat(businessModelList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void getAllBusinessModelsAsStream() {
        // Initialize the database
        businessModelRepository.save(businessModel).block();

        List<BusinessModel> businessModelList = webTestClient
            .get()
            .uri(ENTITY_API_URL)
            .accept(MediaType.APPLICATION_NDJSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentTypeCompatibleWith(MediaType.APPLICATION_NDJSON)
            .returnResult(BusinessModel.class)
            .getResponseBody()
            .filter(businessModel::equals)
            .collectList()
            .block(Duration.ofSeconds(5));

        assertThat(businessModelList).isNotNull();
        assertThat(businessModelList).hasSize(1);
        BusinessModel testBusinessModel = businessModelList.get(0);
        assertThat(testBusinessModel.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testBusinessModel.getType()).isEqualTo(DEFAULT_TYPE);
        assertThat(testBusinessModel.getCategory()).isEqualTo(DEFAULT_CATEGORY);
    }

    @Test
    void getAllBusinessModels() {
        // Initialize the database
        businessModelRepository.save(businessModel).block();

        // Get all the businessModelList
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
            .value(hasItem(businessModel.getId()))
            .jsonPath("$.[*].name")
            .value(hasItem(DEFAULT_NAME))
            .jsonPath("$.[*].type")
            .value(hasItem(DEFAULT_TYPE.toString()))
            .jsonPath("$.[*].category")
            .value(hasItem(DEFAULT_CATEGORY.toString()));
    }

    @Test
    void getBusinessModel() {
        // Initialize the database
        businessModelRepository.save(businessModel).block();

        // Get the businessModel
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, businessModel.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.id")
            .value(is(businessModel.getId()))
            .jsonPath("$.name")
            .value(is(DEFAULT_NAME))
            .jsonPath("$.type")
            .value(is(DEFAULT_TYPE.toString()))
            .jsonPath("$.category")
            .value(is(DEFAULT_CATEGORY.toString()));
    }

    @Test
    void getNonExistingBusinessModel() {
        // Get the businessModel
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, Long.MAX_VALUE)
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNotFound();
    }

    @Test
    void putExistingBusinessModel() throws Exception {
        // Initialize the database
        businessModelRepository.save(businessModel).block();

        int databaseSizeBeforeUpdate = businessModelRepository.findAll().collectList().block().size();

        // Update the businessModel
        BusinessModel updatedBusinessModel = businessModelRepository.findById(businessModel.getId()).block();
        updatedBusinessModel.name(UPDATED_NAME).type(UPDATED_TYPE).category(UPDATED_CATEGORY);

        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, updatedBusinessModel.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(updatedBusinessModel))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the BusinessModel in the database
        List<BusinessModel> businessModelList = businessModelRepository.findAll().collectList().block();
        assertThat(businessModelList).hasSize(databaseSizeBeforeUpdate);
        BusinessModel testBusinessModel = businessModelList.get(businessModelList.size() - 1);
        assertThat(testBusinessModel.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testBusinessModel.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testBusinessModel.getCategory()).isEqualTo(UPDATED_CATEGORY);
    }

    @Test
    void putNonExistingBusinessModel() throws Exception {
        int databaseSizeBeforeUpdate = businessModelRepository.findAll().collectList().block().size();
        businessModel.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, businessModel.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(businessModel))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the BusinessModel in the database
        List<BusinessModel> businessModelList = businessModelRepository.findAll().collectList().block();
        assertThat(businessModelList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchBusinessModel() throws Exception {
        int databaseSizeBeforeUpdate = businessModelRepository.findAll().collectList().block().size();
        businessModel.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, UUID.randomUUID().toString())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(businessModel))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the BusinessModel in the database
        List<BusinessModel> businessModelList = businessModelRepository.findAll().collectList().block();
        assertThat(businessModelList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamBusinessModel() throws Exception {
        int databaseSizeBeforeUpdate = businessModelRepository.findAll().collectList().block().size();
        businessModel.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(businessModel))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the BusinessModel in the database
        List<BusinessModel> businessModelList = businessModelRepository.findAll().collectList().block();
        assertThat(businessModelList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateBusinessModelWithPatch() throws Exception {
        // Initialize the database
        businessModelRepository.save(businessModel).block();

        int databaseSizeBeforeUpdate = businessModelRepository.findAll().collectList().block().size();

        // Update the businessModel using partial update
        BusinessModel partialUpdatedBusinessModel = new BusinessModel();
        partialUpdatedBusinessModel.setId(businessModel.getId());

        partialUpdatedBusinessModel.type(UPDATED_TYPE).category(UPDATED_CATEGORY);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedBusinessModel.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedBusinessModel))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the BusinessModel in the database
        List<BusinessModel> businessModelList = businessModelRepository.findAll().collectList().block();
        assertThat(businessModelList).hasSize(databaseSizeBeforeUpdate);
        BusinessModel testBusinessModel = businessModelList.get(businessModelList.size() - 1);
        assertThat(testBusinessModel.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testBusinessModel.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testBusinessModel.getCategory()).isEqualTo(UPDATED_CATEGORY);
    }

    @Test
    void fullUpdateBusinessModelWithPatch() throws Exception {
        // Initialize the database
        businessModelRepository.save(businessModel).block();

        int databaseSizeBeforeUpdate = businessModelRepository.findAll().collectList().block().size();

        // Update the businessModel using partial update
        BusinessModel partialUpdatedBusinessModel = new BusinessModel();
        partialUpdatedBusinessModel.setId(businessModel.getId());

        partialUpdatedBusinessModel.name(UPDATED_NAME).type(UPDATED_TYPE).category(UPDATED_CATEGORY);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedBusinessModel.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedBusinessModel))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the BusinessModel in the database
        List<BusinessModel> businessModelList = businessModelRepository.findAll().collectList().block();
        assertThat(businessModelList).hasSize(databaseSizeBeforeUpdate);
        BusinessModel testBusinessModel = businessModelList.get(businessModelList.size() - 1);
        assertThat(testBusinessModel.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testBusinessModel.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testBusinessModel.getCategory()).isEqualTo(UPDATED_CATEGORY);
    }

    @Test
    void patchNonExistingBusinessModel() throws Exception {
        int databaseSizeBeforeUpdate = businessModelRepository.findAll().collectList().block().size();
        businessModel.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, businessModel.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(businessModel))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the BusinessModel in the database
        List<BusinessModel> businessModelList = businessModelRepository.findAll().collectList().block();
        assertThat(businessModelList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchBusinessModel() throws Exception {
        int databaseSizeBeforeUpdate = businessModelRepository.findAll().collectList().block().size();
        businessModel.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, UUID.randomUUID().toString())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(businessModel))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the BusinessModel in the database
        List<BusinessModel> businessModelList = businessModelRepository.findAll().collectList().block();
        assertThat(businessModelList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamBusinessModel() throws Exception {
        int databaseSizeBeforeUpdate = businessModelRepository.findAll().collectList().block().size();
        businessModel.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(businessModel))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the BusinessModel in the database
        List<BusinessModel> businessModelList = businessModelRepository.findAll().collectList().block();
        assertThat(businessModelList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteBusinessModel() {
        // Initialize the database
        businessModelRepository.save(businessModel).block();

        int databaseSizeBeforeDelete = businessModelRepository.findAll().collectList().block().size();

        // Delete the businessModel
        webTestClient
            .delete()
            .uri(ENTITY_API_URL_ID, businessModel.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        // Validate the database contains one less item
        List<BusinessModel> businessModelList = businessModelRepository.findAll().collectList().block();
        assertThat(businessModelList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
