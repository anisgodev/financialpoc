package com.bnppf.alphacredit.creditproductdesigner.web.rest;

import com.bnppf.alphacredit.creditproductdesigner.domain.Simulation;
import com.bnppf.alphacredit.creditproductdesigner.repository.SimulationRepository;
import com.bnppf.alphacredit.creditproductdesigner.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.reactive.ResponseUtil;

/**
 * REST controller for managing {@link com.bnppf.alphacredit.creditproductdesigner.domain.Simulation}.
 */
@RestController
@RequestMapping("/api")
public class SimulationResource {

    private final Logger log = LoggerFactory.getLogger(SimulationResource.class);

    private static final String ENTITY_NAME = "simulation";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SimulationRepository simulationRepository;

    public SimulationResource(SimulationRepository simulationRepository) {
        this.simulationRepository = simulationRepository;
    }

    /**
     * {@code POST  /simulations} : Create a new simulation.
     *
     * @param simulation the simulation to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new simulation, or with status {@code 400 (Bad Request)} if the simulation has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/simulations")
    public Mono<ResponseEntity<Simulation>> createSimulation(@Valid @RequestBody Simulation simulation) throws URISyntaxException {
        log.debug("REST request to save Simulation : {}", simulation);
        if (simulation.getId() != null) {
            throw new BadRequestAlertException("A new simulation cannot already have an ID", ENTITY_NAME, "idexists");
        }
        return simulationRepository
            .save(simulation)
            .map(result -> {
                try {
                    return ResponseEntity
                        .created(new URI("/api/simulations/" + result.getId()))
                        .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId()))
                        .body(result);
                } catch (URISyntaxException e) {
                    throw new RuntimeException(e);
                }
            });
    }

    /**
     * {@code PUT  /simulations/:id} : Updates an existing simulation.
     *
     * @param id the id of the simulation to save.
     * @param simulation the simulation to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated simulation,
     * or with status {@code 400 (Bad Request)} if the simulation is not valid,
     * or with status {@code 500 (Internal Server Error)} if the simulation couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/simulations/{id}")
    public Mono<ResponseEntity<Simulation>> updateSimulation(
        @PathVariable(value = "id", required = false) final String id,
        @Valid @RequestBody Simulation simulation
    ) throws URISyntaxException {
        log.debug("REST request to update Simulation : {}, {}", id, simulation);
        if (simulation.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, simulation.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return simulationRepository
            .existsById(id)
            .flatMap(exists -> {
                if (!exists) {
                    return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                }

                return simulationRepository
                    .save(simulation)
                    .switchIfEmpty(Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND)))
                    .map(result ->
                        ResponseEntity
                            .ok()
                            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, result.getId()))
                            .body(result)
                    );
            });
    }

    /**
     * {@code PATCH  /simulations/:id} : Partial updates given fields of an existing simulation, field will ignore if it is null
     *
     * @param id the id of the simulation to save.
     * @param simulation the simulation to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated simulation,
     * or with status {@code 400 (Bad Request)} if the simulation is not valid,
     * or with status {@code 404 (Not Found)} if the simulation is not found,
     * or with status {@code 500 (Internal Server Error)} if the simulation couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/simulations/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public Mono<ResponseEntity<Simulation>> partialUpdateSimulation(
        @PathVariable(value = "id", required = false) final String id,
        @NotNull @RequestBody Simulation simulation
    ) throws URISyntaxException {
        log.debug("REST request to partial update Simulation partially : {}, {}", id, simulation);
        if (simulation.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, simulation.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return simulationRepository
            .existsById(id)
            .flatMap(exists -> {
                if (!exists) {
                    return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                }

                Mono<Simulation> result = simulationRepository
                    .findById(simulation.getId())
                    .map(existingSimulation -> {
                        if (simulation.getName() != null) {
                            existingSimulation.setName(simulation.getName());
                        }

                        return existingSimulation;
                    })
                    .flatMap(simulationRepository::save);

                return result
                    .switchIfEmpty(Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND)))
                    .map(res ->
                        ResponseEntity
                            .ok()
                            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, res.getId()))
                            .body(res)
                    );
            });
    }

    /**
     * {@code GET  /simulations} : get all the simulations.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of simulations in body.
     */
    @GetMapping("/simulations")
    public Mono<List<Simulation>> getAllSimulations() {
        log.debug("REST request to get all Simulations");
        return simulationRepository.findAll().collectList();
    }

    /**
     * {@code GET  /simulations} : get all the simulations as a stream.
     * @return the {@link Flux} of simulations.
     */
    @GetMapping(value = "/simulations", produces = MediaType.APPLICATION_NDJSON_VALUE)
    public Flux<Simulation> getAllSimulationsAsStream() {
        log.debug("REST request to get all Simulations as a stream");
        return simulationRepository.findAll();
    }

    /**
     * {@code GET  /simulations/:id} : get the "id" simulation.
     *
     * @param id the id of the simulation to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the simulation, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/simulations/{id}")
    public Mono<ResponseEntity<Simulation>> getSimulation(@PathVariable String id) {
        log.debug("REST request to get Simulation : {}", id);
        Mono<Simulation> simulation = simulationRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(simulation);
    }

    /**
     * {@code DELETE  /simulations/:id} : delete the "id" simulation.
     *
     * @param id the id of the simulation to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/simulations/{id}")
    public Mono<ResponseEntity<Void>> deleteSimulation(@PathVariable String id) {
        log.debug("REST request to delete Simulation : {}", id);
        return simulationRepository
            .deleteById(id)
            .then(
                Mono.just(
                    ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id)).build()
                )
            );
    }
}
