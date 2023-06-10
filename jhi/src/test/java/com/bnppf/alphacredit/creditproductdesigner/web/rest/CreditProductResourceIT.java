package com.bnppf.alphacredit.creditproductdesigner.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.is;

import com.bnppf.alphacredit.creditproductdesigner.IntegrationTest;
import com.bnppf.alphacredit.creditproductdesigner.domain.CreditProduct;
import com.bnppf.alphacredit.creditproductdesigner.repository.CreditProductRepository;
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
 * Integration tests for the {@link CreditProductResource} REST controller.
 */
@IntegrationTest
@AutoConfigureWebTestClient(timeout = IntegrationTest.DEFAULT_ENTITY_TIMEOUT)
@WithMockUser
class CreditProductResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/credit-products";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private CreditProductRepository creditProductRepository;

    @Autowired
    private WebTestClient webTestClient;

    private CreditProduct creditProduct;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CreditProduct createEntity() {
        CreditProduct creditProduct = new CreditProduct().name(DEFAULT_NAME);
        return creditProduct;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CreditProduct createUpdatedEntity() {
        CreditProduct creditProduct = new CreditProduct().name(UPDATED_NAME);
        return creditProduct;
    }

    @BeforeEach
    public void initTest() {
        creditProductRepository.deleteAll().block();
        creditProduct = createEntity();
    }

    @Test
    void createCreditProduct() throws Exception {
        int databaseSizeBeforeCreate = creditProductRepository.findAll().collectList().block().size();
        // Create the CreditProduct
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(creditProduct))
            .exchange()
            .expectStatus()
            .isCreated();

        // Validate the CreditProduct in the database
        List<CreditProduct> creditProductList = creditProductRepository.findAll().collectList().block();
        assertThat(creditProductList).hasSize(databaseSizeBeforeCreate + 1);
        CreditProduct testCreditProduct = creditProductList.get(creditProductList.size() - 1);
        assertThat(testCreditProduct.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    void createCreditProductWithExistingId() throws Exception {
        // Create the CreditProduct with an existing ID
        creditProduct.setId("existing_id");

        int databaseSizeBeforeCreate = creditProductRepository.findAll().collectList().block().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(creditProduct))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the CreditProduct in the database
        List<CreditProduct> creditProductList = creditProductRepository.findAll().collectList().block();
        assertThat(creditProductList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = creditProductRepository.findAll().collectList().block().size();
        // set the field null
        creditProduct.setName(null);

        // Create the CreditProduct, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(creditProduct))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<CreditProduct> creditProductList = creditProductRepository.findAll().collectList().block();
        assertThat(creditProductList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void getAllCreditProductsAsStream() {
        // Initialize the database
        creditProductRepository.save(creditProduct).block();

        List<CreditProduct> creditProductList = webTestClient
            .get()
            .uri(ENTITY_API_URL)
            .accept(MediaType.APPLICATION_NDJSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentTypeCompatibleWith(MediaType.APPLICATION_NDJSON)
            .returnResult(CreditProduct.class)
            .getResponseBody()
            .filter(creditProduct::equals)
            .collectList()
            .block(Duration.ofSeconds(5));

        assertThat(creditProductList).isNotNull();
        assertThat(creditProductList).hasSize(1);
        CreditProduct testCreditProduct = creditProductList.get(0);
        assertThat(testCreditProduct.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    void getAllCreditProducts() {
        // Initialize the database
        creditProductRepository.save(creditProduct).block();

        // Get all the creditProductList
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
            .value(hasItem(creditProduct.getId()))
            .jsonPath("$.[*].name")
            .value(hasItem(DEFAULT_NAME));
    }

    @Test
    void getCreditProduct() {
        // Initialize the database
        creditProductRepository.save(creditProduct).block();

        // Get the creditProduct
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, creditProduct.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.id")
            .value(is(creditProduct.getId()))
            .jsonPath("$.name")
            .value(is(DEFAULT_NAME));
    }

    @Test
    void getNonExistingCreditProduct() {
        // Get the creditProduct
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, Long.MAX_VALUE)
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNotFound();
    }

    @Test
    void putExistingCreditProduct() throws Exception {
        // Initialize the database
        creditProductRepository.save(creditProduct).block();

        int databaseSizeBeforeUpdate = creditProductRepository.findAll().collectList().block().size();

        // Update the creditProduct
        CreditProduct updatedCreditProduct = creditProductRepository.findById(creditProduct.getId()).block();
        updatedCreditProduct.name(UPDATED_NAME);

        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, updatedCreditProduct.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(updatedCreditProduct))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the CreditProduct in the database
        List<CreditProduct> creditProductList = creditProductRepository.findAll().collectList().block();
        assertThat(creditProductList).hasSize(databaseSizeBeforeUpdate);
        CreditProduct testCreditProduct = creditProductList.get(creditProductList.size() - 1);
        assertThat(testCreditProduct.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    void putNonExistingCreditProduct() throws Exception {
        int databaseSizeBeforeUpdate = creditProductRepository.findAll().collectList().block().size();
        creditProduct.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, creditProduct.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(creditProduct))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the CreditProduct in the database
        List<CreditProduct> creditProductList = creditProductRepository.findAll().collectList().block();
        assertThat(creditProductList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchCreditProduct() throws Exception {
        int databaseSizeBeforeUpdate = creditProductRepository.findAll().collectList().block().size();
        creditProduct.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, UUID.randomUUID().toString())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(creditProduct))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the CreditProduct in the database
        List<CreditProduct> creditProductList = creditProductRepository.findAll().collectList().block();
        assertThat(creditProductList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamCreditProduct() throws Exception {
        int databaseSizeBeforeUpdate = creditProductRepository.findAll().collectList().block().size();
        creditProduct.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(creditProduct))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the CreditProduct in the database
        List<CreditProduct> creditProductList = creditProductRepository.findAll().collectList().block();
        assertThat(creditProductList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateCreditProductWithPatch() throws Exception {
        // Initialize the database
        creditProductRepository.save(creditProduct).block();

        int databaseSizeBeforeUpdate = creditProductRepository.findAll().collectList().block().size();

        // Update the creditProduct using partial update
        CreditProduct partialUpdatedCreditProduct = new CreditProduct();
        partialUpdatedCreditProduct.setId(creditProduct.getId());

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedCreditProduct.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedCreditProduct))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the CreditProduct in the database
        List<CreditProduct> creditProductList = creditProductRepository.findAll().collectList().block();
        assertThat(creditProductList).hasSize(databaseSizeBeforeUpdate);
        CreditProduct testCreditProduct = creditProductList.get(creditProductList.size() - 1);
        assertThat(testCreditProduct.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    void fullUpdateCreditProductWithPatch() throws Exception {
        // Initialize the database
        creditProductRepository.save(creditProduct).block();

        int databaseSizeBeforeUpdate = creditProductRepository.findAll().collectList().block().size();

        // Update the creditProduct using partial update
        CreditProduct partialUpdatedCreditProduct = new CreditProduct();
        partialUpdatedCreditProduct.setId(creditProduct.getId());

        partialUpdatedCreditProduct.name(UPDATED_NAME);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedCreditProduct.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedCreditProduct))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the CreditProduct in the database
        List<CreditProduct> creditProductList = creditProductRepository.findAll().collectList().block();
        assertThat(creditProductList).hasSize(databaseSizeBeforeUpdate);
        CreditProduct testCreditProduct = creditProductList.get(creditProductList.size() - 1);
        assertThat(testCreditProduct.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    void patchNonExistingCreditProduct() throws Exception {
        int databaseSizeBeforeUpdate = creditProductRepository.findAll().collectList().block().size();
        creditProduct.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, creditProduct.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(creditProduct))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the CreditProduct in the database
        List<CreditProduct> creditProductList = creditProductRepository.findAll().collectList().block();
        assertThat(creditProductList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchCreditProduct() throws Exception {
        int databaseSizeBeforeUpdate = creditProductRepository.findAll().collectList().block().size();
        creditProduct.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, UUID.randomUUID().toString())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(creditProduct))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the CreditProduct in the database
        List<CreditProduct> creditProductList = creditProductRepository.findAll().collectList().block();
        assertThat(creditProductList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamCreditProduct() throws Exception {
        int databaseSizeBeforeUpdate = creditProductRepository.findAll().collectList().block().size();
        creditProduct.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(creditProduct))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the CreditProduct in the database
        List<CreditProduct> creditProductList = creditProductRepository.findAll().collectList().block();
        assertThat(creditProductList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteCreditProduct() {
        // Initialize the database
        creditProductRepository.save(creditProduct).block();

        int databaseSizeBeforeDelete = creditProductRepository.findAll().collectList().block().size();

        // Delete the creditProduct
        webTestClient
            .delete()
            .uri(ENTITY_API_URL_ID, creditProduct.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        // Validate the database contains one less item
        List<CreditProduct> creditProductList = creditProductRepository.findAll().collectList().block();
        assertThat(creditProductList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
