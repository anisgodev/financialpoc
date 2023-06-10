package com.bnppf.alphacredit.creditproductdesigner.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.is;

import com.bnppf.alphacredit.creditproductdesigner.IntegrationTest;
import com.bnppf.alphacredit.creditproductdesigner.domain.CreditProductInstance;
import com.bnppf.alphacredit.creditproductdesigner.repository.CreditProductInstanceRepository;
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
 * Integration tests for the {@link CreditProductInstanceResource} REST controller.
 */
@IntegrationTest
@AutoConfigureWebTestClient(timeout = IntegrationTest.DEFAULT_ENTITY_TIMEOUT)
@WithMockUser
class CreditProductInstanceResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/credit-product-instances";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private CreditProductInstanceRepository creditProductInstanceRepository;

    @Autowired
    private WebTestClient webTestClient;

    private CreditProductInstance creditProductInstance;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CreditProductInstance createEntity() {
        CreditProductInstance creditProductInstance = new CreditProductInstance().name(DEFAULT_NAME);
        return creditProductInstance;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CreditProductInstance createUpdatedEntity() {
        CreditProductInstance creditProductInstance = new CreditProductInstance().name(UPDATED_NAME);
        return creditProductInstance;
    }

    @BeforeEach
    public void initTest() {
        creditProductInstanceRepository.deleteAll().block();
        creditProductInstance = createEntity();
    }

    @Test
    void createCreditProductInstance() throws Exception {
        int databaseSizeBeforeCreate = creditProductInstanceRepository.findAll().collectList().block().size();
        // Create the CreditProductInstance
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(creditProductInstance))
            .exchange()
            .expectStatus()
            .isCreated();

        // Validate the CreditProductInstance in the database
        List<CreditProductInstance> creditProductInstanceList = creditProductInstanceRepository.findAll().collectList().block();
        assertThat(creditProductInstanceList).hasSize(databaseSizeBeforeCreate + 1);
        CreditProductInstance testCreditProductInstance = creditProductInstanceList.get(creditProductInstanceList.size() - 1);
        assertThat(testCreditProductInstance.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    void createCreditProductInstanceWithExistingId() throws Exception {
        // Create the CreditProductInstance with an existing ID
        creditProductInstance.setId("existing_id");

        int databaseSizeBeforeCreate = creditProductInstanceRepository.findAll().collectList().block().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(creditProductInstance))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the CreditProductInstance in the database
        List<CreditProductInstance> creditProductInstanceList = creditProductInstanceRepository.findAll().collectList().block();
        assertThat(creditProductInstanceList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = creditProductInstanceRepository.findAll().collectList().block().size();
        // set the field null
        creditProductInstance.setName(null);

        // Create the CreditProductInstance, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(creditProductInstance))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<CreditProductInstance> creditProductInstanceList = creditProductInstanceRepository.findAll().collectList().block();
        assertThat(creditProductInstanceList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void getAllCreditProductInstancesAsStream() {
        // Initialize the database
        creditProductInstanceRepository.save(creditProductInstance).block();

        List<CreditProductInstance> creditProductInstanceList = webTestClient
            .get()
            .uri(ENTITY_API_URL)
            .accept(MediaType.APPLICATION_NDJSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentTypeCompatibleWith(MediaType.APPLICATION_NDJSON)
            .returnResult(CreditProductInstance.class)
            .getResponseBody()
            .filter(creditProductInstance::equals)
            .collectList()
            .block(Duration.ofSeconds(5));

        assertThat(creditProductInstanceList).isNotNull();
        assertThat(creditProductInstanceList).hasSize(1);
        CreditProductInstance testCreditProductInstance = creditProductInstanceList.get(0);
        assertThat(testCreditProductInstance.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    void getAllCreditProductInstances() {
        // Initialize the database
        creditProductInstanceRepository.save(creditProductInstance).block();

        // Get all the creditProductInstanceList
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
            .value(hasItem(creditProductInstance.getId()))
            .jsonPath("$.[*].name")
            .value(hasItem(DEFAULT_NAME));
    }

    @Test
    void getCreditProductInstance() {
        // Initialize the database
        creditProductInstanceRepository.save(creditProductInstance).block();

        // Get the creditProductInstance
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, creditProductInstance.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.id")
            .value(is(creditProductInstance.getId()))
            .jsonPath("$.name")
            .value(is(DEFAULT_NAME));
    }

    @Test
    void getNonExistingCreditProductInstance() {
        // Get the creditProductInstance
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, Long.MAX_VALUE)
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNotFound();
    }

    @Test
    void putExistingCreditProductInstance() throws Exception {
        // Initialize the database
        creditProductInstanceRepository.save(creditProductInstance).block();

        int databaseSizeBeforeUpdate = creditProductInstanceRepository.findAll().collectList().block().size();

        // Update the creditProductInstance
        CreditProductInstance updatedCreditProductInstance = creditProductInstanceRepository
            .findById(creditProductInstance.getId())
            .block();
        updatedCreditProductInstance.name(UPDATED_NAME);

        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, updatedCreditProductInstance.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(updatedCreditProductInstance))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the CreditProductInstance in the database
        List<CreditProductInstance> creditProductInstanceList = creditProductInstanceRepository.findAll().collectList().block();
        assertThat(creditProductInstanceList).hasSize(databaseSizeBeforeUpdate);
        CreditProductInstance testCreditProductInstance = creditProductInstanceList.get(creditProductInstanceList.size() - 1);
        assertThat(testCreditProductInstance.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    void putNonExistingCreditProductInstance() throws Exception {
        int databaseSizeBeforeUpdate = creditProductInstanceRepository.findAll().collectList().block().size();
        creditProductInstance.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, creditProductInstance.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(creditProductInstance))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the CreditProductInstance in the database
        List<CreditProductInstance> creditProductInstanceList = creditProductInstanceRepository.findAll().collectList().block();
        assertThat(creditProductInstanceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchCreditProductInstance() throws Exception {
        int databaseSizeBeforeUpdate = creditProductInstanceRepository.findAll().collectList().block().size();
        creditProductInstance.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, UUID.randomUUID().toString())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(creditProductInstance))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the CreditProductInstance in the database
        List<CreditProductInstance> creditProductInstanceList = creditProductInstanceRepository.findAll().collectList().block();
        assertThat(creditProductInstanceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamCreditProductInstance() throws Exception {
        int databaseSizeBeforeUpdate = creditProductInstanceRepository.findAll().collectList().block().size();
        creditProductInstance.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(creditProductInstance))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the CreditProductInstance in the database
        List<CreditProductInstance> creditProductInstanceList = creditProductInstanceRepository.findAll().collectList().block();
        assertThat(creditProductInstanceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateCreditProductInstanceWithPatch() throws Exception {
        // Initialize the database
        creditProductInstanceRepository.save(creditProductInstance).block();

        int databaseSizeBeforeUpdate = creditProductInstanceRepository.findAll().collectList().block().size();

        // Update the creditProductInstance using partial update
        CreditProductInstance partialUpdatedCreditProductInstance = new CreditProductInstance();
        partialUpdatedCreditProductInstance.setId(creditProductInstance.getId());

        partialUpdatedCreditProductInstance.name(UPDATED_NAME);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedCreditProductInstance.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedCreditProductInstance))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the CreditProductInstance in the database
        List<CreditProductInstance> creditProductInstanceList = creditProductInstanceRepository.findAll().collectList().block();
        assertThat(creditProductInstanceList).hasSize(databaseSizeBeforeUpdate);
        CreditProductInstance testCreditProductInstance = creditProductInstanceList.get(creditProductInstanceList.size() - 1);
        assertThat(testCreditProductInstance.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    void fullUpdateCreditProductInstanceWithPatch() throws Exception {
        // Initialize the database
        creditProductInstanceRepository.save(creditProductInstance).block();

        int databaseSizeBeforeUpdate = creditProductInstanceRepository.findAll().collectList().block().size();

        // Update the creditProductInstance using partial update
        CreditProductInstance partialUpdatedCreditProductInstance = new CreditProductInstance();
        partialUpdatedCreditProductInstance.setId(creditProductInstance.getId());

        partialUpdatedCreditProductInstance.name(UPDATED_NAME);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedCreditProductInstance.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedCreditProductInstance))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the CreditProductInstance in the database
        List<CreditProductInstance> creditProductInstanceList = creditProductInstanceRepository.findAll().collectList().block();
        assertThat(creditProductInstanceList).hasSize(databaseSizeBeforeUpdate);
        CreditProductInstance testCreditProductInstance = creditProductInstanceList.get(creditProductInstanceList.size() - 1);
        assertThat(testCreditProductInstance.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    void patchNonExistingCreditProductInstance() throws Exception {
        int databaseSizeBeforeUpdate = creditProductInstanceRepository.findAll().collectList().block().size();
        creditProductInstance.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, creditProductInstance.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(creditProductInstance))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the CreditProductInstance in the database
        List<CreditProductInstance> creditProductInstanceList = creditProductInstanceRepository.findAll().collectList().block();
        assertThat(creditProductInstanceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchCreditProductInstance() throws Exception {
        int databaseSizeBeforeUpdate = creditProductInstanceRepository.findAll().collectList().block().size();
        creditProductInstance.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, UUID.randomUUID().toString())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(creditProductInstance))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the CreditProductInstance in the database
        List<CreditProductInstance> creditProductInstanceList = creditProductInstanceRepository.findAll().collectList().block();
        assertThat(creditProductInstanceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamCreditProductInstance() throws Exception {
        int databaseSizeBeforeUpdate = creditProductInstanceRepository.findAll().collectList().block().size();
        creditProductInstance.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(creditProductInstance))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the CreditProductInstance in the database
        List<CreditProductInstance> creditProductInstanceList = creditProductInstanceRepository.findAll().collectList().block();
        assertThat(creditProductInstanceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteCreditProductInstance() {
        // Initialize the database
        creditProductInstanceRepository.save(creditProductInstance).block();

        int databaseSizeBeforeDelete = creditProductInstanceRepository.findAll().collectList().block().size();

        // Delete the creditProductInstance
        webTestClient
            .delete()
            .uri(ENTITY_API_URL_ID, creditProductInstance.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        // Validate the database contains one less item
        List<CreditProductInstance> creditProductInstanceList = creditProductInstanceRepository.findAll().collectList().block();
        assertThat(creditProductInstanceList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
