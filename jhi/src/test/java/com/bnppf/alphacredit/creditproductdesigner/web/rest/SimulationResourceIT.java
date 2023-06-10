package com.bnppf.alphacredit.creditproductdesigner.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.is;

import com.bnppf.alphacredit.creditproductdesigner.IntegrationTest;
import com.bnppf.alphacredit.creditproductdesigner.domain.Simulation;
import com.bnppf.alphacredit.creditproductdesigner.repository.SimulationRepository;
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
 * Integration tests for the {@link SimulationResource} REST controller.
 */
@IntegrationTest
@AutoConfigureWebTestClient(timeout = IntegrationTest.DEFAULT_ENTITY_TIMEOUT)
@WithMockUser
class SimulationResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/simulations";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private SimulationRepository simulationRepository;

    @Autowired
    private WebTestClient webTestClient;

    private Simulation simulation;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Simulation createEntity() {
        Simulation simulation = new Simulation().name(DEFAULT_NAME);
        return simulation;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Simulation createUpdatedEntity() {
        Simulation simulation = new Simulation().name(UPDATED_NAME);
        return simulation;
    }

    @BeforeEach
    public void initTest() {
        simulationRepository.deleteAll().block();
        simulation = createEntity();
    }

    @Test
    void createSimulation() throws Exception {
        int databaseSizeBeforeCreate = simulationRepository.findAll().collectList().block().size();
        // Create the Simulation
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(simulation))
            .exchange()
            .expectStatus()
            .isCreated();

        // Validate the Simulation in the database
        List<Simulation> simulationList = simulationRepository.findAll().collectList().block();
        assertThat(simulationList).hasSize(databaseSizeBeforeCreate + 1);
        Simulation testSimulation = simulationList.get(simulationList.size() - 1);
        assertThat(testSimulation.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    void createSimulationWithExistingId() throws Exception {
        // Create the Simulation with an existing ID
        simulation.setId("existing_id");

        int databaseSizeBeforeCreate = simulationRepository.findAll().collectList().block().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(simulation))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Simulation in the database
        List<Simulation> simulationList = simulationRepository.findAll().collectList().block();
        assertThat(simulationList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = simulationRepository.findAll().collectList().block().size();
        // set the field null
        simulation.setName(null);

        // Create the Simulation, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(simulation))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Simulation> simulationList = simulationRepository.findAll().collectList().block();
        assertThat(simulationList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void getAllSimulationsAsStream() {
        // Initialize the database
        simulationRepository.save(simulation).block();

        List<Simulation> simulationList = webTestClient
            .get()
            .uri(ENTITY_API_URL)
            .accept(MediaType.APPLICATION_NDJSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentTypeCompatibleWith(MediaType.APPLICATION_NDJSON)
            .returnResult(Simulation.class)
            .getResponseBody()
            .filter(simulation::equals)
            .collectList()
            .block(Duration.ofSeconds(5));

        assertThat(simulationList).isNotNull();
        assertThat(simulationList).hasSize(1);
        Simulation testSimulation = simulationList.get(0);
        assertThat(testSimulation.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    void getAllSimulations() {
        // Initialize the database
        simulationRepository.save(simulation).block();

        // Get all the simulationList
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
            .value(hasItem(simulation.getId()))
            .jsonPath("$.[*].name")
            .value(hasItem(DEFAULT_NAME));
    }

    @Test
    void getSimulation() {
        // Initialize the database
        simulationRepository.save(simulation).block();

        // Get the simulation
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, simulation.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.id")
            .value(is(simulation.getId()))
            .jsonPath("$.name")
            .value(is(DEFAULT_NAME));
    }

    @Test
    void getNonExistingSimulation() {
        // Get the simulation
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, Long.MAX_VALUE)
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNotFound();
    }

    @Test
    void putExistingSimulation() throws Exception {
        // Initialize the database
        simulationRepository.save(simulation).block();

        int databaseSizeBeforeUpdate = simulationRepository.findAll().collectList().block().size();

        // Update the simulation
        Simulation updatedSimulation = simulationRepository.findById(simulation.getId()).block();
        updatedSimulation.name(UPDATED_NAME);

        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, updatedSimulation.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(updatedSimulation))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Simulation in the database
        List<Simulation> simulationList = simulationRepository.findAll().collectList().block();
        assertThat(simulationList).hasSize(databaseSizeBeforeUpdate);
        Simulation testSimulation = simulationList.get(simulationList.size() - 1);
        assertThat(testSimulation.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    void putNonExistingSimulation() throws Exception {
        int databaseSizeBeforeUpdate = simulationRepository.findAll().collectList().block().size();
        simulation.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, simulation.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(simulation))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Simulation in the database
        List<Simulation> simulationList = simulationRepository.findAll().collectList().block();
        assertThat(simulationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchSimulation() throws Exception {
        int databaseSizeBeforeUpdate = simulationRepository.findAll().collectList().block().size();
        simulation.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, UUID.randomUUID().toString())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(simulation))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Simulation in the database
        List<Simulation> simulationList = simulationRepository.findAll().collectList().block();
        assertThat(simulationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamSimulation() throws Exception {
        int databaseSizeBeforeUpdate = simulationRepository.findAll().collectList().block().size();
        simulation.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(simulation))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Simulation in the database
        List<Simulation> simulationList = simulationRepository.findAll().collectList().block();
        assertThat(simulationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateSimulationWithPatch() throws Exception {
        // Initialize the database
        simulationRepository.save(simulation).block();

        int databaseSizeBeforeUpdate = simulationRepository.findAll().collectList().block().size();

        // Update the simulation using partial update
        Simulation partialUpdatedSimulation = new Simulation();
        partialUpdatedSimulation.setId(simulation.getId());

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedSimulation.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedSimulation))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Simulation in the database
        List<Simulation> simulationList = simulationRepository.findAll().collectList().block();
        assertThat(simulationList).hasSize(databaseSizeBeforeUpdate);
        Simulation testSimulation = simulationList.get(simulationList.size() - 1);
        assertThat(testSimulation.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    void fullUpdateSimulationWithPatch() throws Exception {
        // Initialize the database
        simulationRepository.save(simulation).block();

        int databaseSizeBeforeUpdate = simulationRepository.findAll().collectList().block().size();

        // Update the simulation using partial update
        Simulation partialUpdatedSimulation = new Simulation();
        partialUpdatedSimulation.setId(simulation.getId());

        partialUpdatedSimulation.name(UPDATED_NAME);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedSimulation.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedSimulation))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Simulation in the database
        List<Simulation> simulationList = simulationRepository.findAll().collectList().block();
        assertThat(simulationList).hasSize(databaseSizeBeforeUpdate);
        Simulation testSimulation = simulationList.get(simulationList.size() - 1);
        assertThat(testSimulation.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    void patchNonExistingSimulation() throws Exception {
        int databaseSizeBeforeUpdate = simulationRepository.findAll().collectList().block().size();
        simulation.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, simulation.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(simulation))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Simulation in the database
        List<Simulation> simulationList = simulationRepository.findAll().collectList().block();
        assertThat(simulationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchSimulation() throws Exception {
        int databaseSizeBeforeUpdate = simulationRepository.findAll().collectList().block().size();
        simulation.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, UUID.randomUUID().toString())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(simulation))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Simulation in the database
        List<Simulation> simulationList = simulationRepository.findAll().collectList().block();
        assertThat(simulationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamSimulation() throws Exception {
        int databaseSizeBeforeUpdate = simulationRepository.findAll().collectList().block().size();
        simulation.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(simulation))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Simulation in the database
        List<Simulation> simulationList = simulationRepository.findAll().collectList().block();
        assertThat(simulationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteSimulation() {
        // Initialize the database
        simulationRepository.save(simulation).block();

        int databaseSizeBeforeDelete = simulationRepository.findAll().collectList().block().size();

        // Delete the simulation
        webTestClient
            .delete()
            .uri(ENTITY_API_URL_ID, simulation.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        // Validate the database contains one less item
        List<Simulation> simulationList = simulationRepository.findAll().collectList().block();
        assertThat(simulationList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
