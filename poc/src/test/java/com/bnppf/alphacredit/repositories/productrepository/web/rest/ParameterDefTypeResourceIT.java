package com.bnppf.alphacredit.repositories.productrepository.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.bnppf.alphacredit.repositories.productrepository.IntegrationTest;
import com.bnppf.alphacredit.repositories.productrepository.domain.ParameterDefType;
import com.bnppf.alphacredit.repositories.productrepository.domain.enumeration.ParameterGroupEnum;
import com.bnppf.alphacredit.repositories.productrepository.repository.ParameterDefTypeRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ParameterDefTypeResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ParameterDefTypeResourceIT {

    private static final String DEFAULT_FIELD_NAME = "AAAAAAAAAA";
    private static final String UPDATED_FIELD_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_LABEL = "AAAAAAAAAA";
    private static final String UPDATED_LABEL = "BBBBBBBBBB";

    private static final ParameterGroupEnum DEFAULT_PARAMETER_GROUP_ENUM = ParameterGroupEnum.NUMERIC;
    private static final ParameterGroupEnum UPDATED_PARAMETER_GROUP_ENUM = ParameterGroupEnum.TEXT;

    private static final String ENTITY_API_URL = "/api/parameter-def-types";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ParameterDefTypeRepository parameterDefTypeRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restParameterDefTypeMockMvc;

    private ParameterDefType parameterDefType;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ParameterDefType createEntity(EntityManager em) {
        ParameterDefType parameterDefType = new ParameterDefType()
            .fieldName(DEFAULT_FIELD_NAME)
            .label(DEFAULT_LABEL)
            .parameterGroupEnum(DEFAULT_PARAMETER_GROUP_ENUM);
        return parameterDefType;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ParameterDefType createUpdatedEntity(EntityManager em) {
        ParameterDefType parameterDefType = new ParameterDefType()
            .fieldName(UPDATED_FIELD_NAME)
            .label(UPDATED_LABEL)
            .parameterGroupEnum(UPDATED_PARAMETER_GROUP_ENUM);
        return parameterDefType;
    }

    @BeforeEach
    public void initTest() {
        parameterDefType = createEntity(em);
    }

    @Test
    @Transactional
    void createParameterDefType() throws Exception {
        int databaseSizeBeforeCreate = parameterDefTypeRepository.findAll().size();
        // Create the ParameterDefType
        restParameterDefTypeMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(parameterDefType))
            )
            .andExpect(status().isCreated());

        // Validate the ParameterDefType in the database
        List<ParameterDefType> parameterDefTypeList = parameterDefTypeRepository.findAll();
        assertThat(parameterDefTypeList).hasSize(databaseSizeBeforeCreate + 1);
        ParameterDefType testParameterDefType = parameterDefTypeList.get(parameterDefTypeList.size() - 1);
        assertThat(testParameterDefType.getFieldName()).isEqualTo(DEFAULT_FIELD_NAME);
        assertThat(testParameterDefType.getLabel()).isEqualTo(DEFAULT_LABEL);
        assertThat(testParameterDefType.getParameterGroupEnum()).isEqualTo(DEFAULT_PARAMETER_GROUP_ENUM);
    }

    @Test
    @Transactional
    void createParameterDefTypeWithExistingId() throws Exception {
        // Create the ParameterDefType with an existing ID
        parameterDefType.setId(1L);

        int databaseSizeBeforeCreate = parameterDefTypeRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restParameterDefTypeMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(parameterDefType))
            )
            .andExpect(status().isBadRequest());

        // Validate the ParameterDefType in the database
        List<ParameterDefType> parameterDefTypeList = parameterDefTypeRepository.findAll();
        assertThat(parameterDefTypeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllParameterDefTypes() throws Exception {
        // Initialize the database
        parameterDefTypeRepository.saveAndFlush(parameterDefType);

        // Get all the parameterDefTypeList
        restParameterDefTypeMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(parameterDefType.getId().intValue())))
            .andExpect(jsonPath("$.[*].fieldName").value(hasItem(DEFAULT_FIELD_NAME)))
            .andExpect(jsonPath("$.[*].label").value(hasItem(DEFAULT_LABEL)))
            .andExpect(jsonPath("$.[*].parameterGroupEnum").value(hasItem(DEFAULT_PARAMETER_GROUP_ENUM.toString())));
    }

    @Test
    @Transactional
    void getParameterDefType() throws Exception {
        // Initialize the database
        parameterDefTypeRepository.saveAndFlush(parameterDefType);

        // Get the parameterDefType
        restParameterDefTypeMockMvc
            .perform(get(ENTITY_API_URL_ID, parameterDefType.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(parameterDefType.getId().intValue()))
            .andExpect(jsonPath("$.fieldName").value(DEFAULT_FIELD_NAME))
            .andExpect(jsonPath("$.label").value(DEFAULT_LABEL))
            .andExpect(jsonPath("$.parameterGroupEnum").value(DEFAULT_PARAMETER_GROUP_ENUM.toString()));
    }

    @Test
    @Transactional
    void getNonExistingParameterDefType() throws Exception {
        // Get the parameterDefType
        restParameterDefTypeMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingParameterDefType() throws Exception {
        // Initialize the database
        parameterDefTypeRepository.saveAndFlush(parameterDefType);

        int databaseSizeBeforeUpdate = parameterDefTypeRepository.findAll().size();

        // Update the parameterDefType
        ParameterDefType updatedParameterDefType = parameterDefTypeRepository.findById(parameterDefType.getId()).get();
        // Disconnect from session so that the updates on updatedParameterDefType are not directly saved in db
        em.detach(updatedParameterDefType);
        updatedParameterDefType.fieldName(UPDATED_FIELD_NAME).label(UPDATED_LABEL).parameterGroupEnum(UPDATED_PARAMETER_GROUP_ENUM);

        restParameterDefTypeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedParameterDefType.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedParameterDefType))
            )
            .andExpect(status().isOk());

        // Validate the ParameterDefType in the database
        List<ParameterDefType> parameterDefTypeList = parameterDefTypeRepository.findAll();
        assertThat(parameterDefTypeList).hasSize(databaseSizeBeforeUpdate);
        ParameterDefType testParameterDefType = parameterDefTypeList.get(parameterDefTypeList.size() - 1);
        assertThat(testParameterDefType.getFieldName()).isEqualTo(UPDATED_FIELD_NAME);
        assertThat(testParameterDefType.getLabel()).isEqualTo(UPDATED_LABEL);
        assertThat(testParameterDefType.getParameterGroupEnum()).isEqualTo(UPDATED_PARAMETER_GROUP_ENUM);
    }

    @Test
    @Transactional
    void putNonExistingParameterDefType() throws Exception {
        int databaseSizeBeforeUpdate = parameterDefTypeRepository.findAll().size();
        parameterDefType.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restParameterDefTypeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, parameterDefType.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(parameterDefType))
            )
            .andExpect(status().isBadRequest());

        // Validate the ParameterDefType in the database
        List<ParameterDefType> parameterDefTypeList = parameterDefTypeRepository.findAll();
        assertThat(parameterDefTypeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchParameterDefType() throws Exception {
        int databaseSizeBeforeUpdate = parameterDefTypeRepository.findAll().size();
        parameterDefType.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restParameterDefTypeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(parameterDefType))
            )
            .andExpect(status().isBadRequest());

        // Validate the ParameterDefType in the database
        List<ParameterDefType> parameterDefTypeList = parameterDefTypeRepository.findAll();
        assertThat(parameterDefTypeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamParameterDefType() throws Exception {
        int databaseSizeBeforeUpdate = parameterDefTypeRepository.findAll().size();
        parameterDefType.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restParameterDefTypeMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(parameterDefType))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ParameterDefType in the database
        List<ParameterDefType> parameterDefTypeList = parameterDefTypeRepository.findAll();
        assertThat(parameterDefTypeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateParameterDefTypeWithPatch() throws Exception {
        // Initialize the database
        parameterDefTypeRepository.saveAndFlush(parameterDefType);

        int databaseSizeBeforeUpdate = parameterDefTypeRepository.findAll().size();

        // Update the parameterDefType using partial update
        ParameterDefType partialUpdatedParameterDefType = new ParameterDefType();
        partialUpdatedParameterDefType.setId(parameterDefType.getId());

        restParameterDefTypeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedParameterDefType.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedParameterDefType))
            )
            .andExpect(status().isOk());

        // Validate the ParameterDefType in the database
        List<ParameterDefType> parameterDefTypeList = parameterDefTypeRepository.findAll();
        assertThat(parameterDefTypeList).hasSize(databaseSizeBeforeUpdate);
        ParameterDefType testParameterDefType = parameterDefTypeList.get(parameterDefTypeList.size() - 1);
        assertThat(testParameterDefType.getFieldName()).isEqualTo(DEFAULT_FIELD_NAME);
        assertThat(testParameterDefType.getLabel()).isEqualTo(DEFAULT_LABEL);
        assertThat(testParameterDefType.getParameterGroupEnum()).isEqualTo(DEFAULT_PARAMETER_GROUP_ENUM);
    }

    @Test
    @Transactional
    void fullUpdateParameterDefTypeWithPatch() throws Exception {
        // Initialize the database
        parameterDefTypeRepository.saveAndFlush(parameterDefType);

        int databaseSizeBeforeUpdate = parameterDefTypeRepository.findAll().size();

        // Update the parameterDefType using partial update
        ParameterDefType partialUpdatedParameterDefType = new ParameterDefType();
        partialUpdatedParameterDefType.setId(parameterDefType.getId());

        partialUpdatedParameterDefType.fieldName(UPDATED_FIELD_NAME).label(UPDATED_LABEL).parameterGroupEnum(UPDATED_PARAMETER_GROUP_ENUM);

        restParameterDefTypeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedParameterDefType.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedParameterDefType))
            )
            .andExpect(status().isOk());

        // Validate the ParameterDefType in the database
        List<ParameterDefType> parameterDefTypeList = parameterDefTypeRepository.findAll();
        assertThat(parameterDefTypeList).hasSize(databaseSizeBeforeUpdate);
        ParameterDefType testParameterDefType = parameterDefTypeList.get(parameterDefTypeList.size() - 1);
        assertThat(testParameterDefType.getFieldName()).isEqualTo(UPDATED_FIELD_NAME);
        assertThat(testParameterDefType.getLabel()).isEqualTo(UPDATED_LABEL);
        assertThat(testParameterDefType.getParameterGroupEnum()).isEqualTo(UPDATED_PARAMETER_GROUP_ENUM);
    }

    @Test
    @Transactional
    void patchNonExistingParameterDefType() throws Exception {
        int databaseSizeBeforeUpdate = parameterDefTypeRepository.findAll().size();
        parameterDefType.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restParameterDefTypeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, parameterDefType.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(parameterDefType))
            )
            .andExpect(status().isBadRequest());

        // Validate the ParameterDefType in the database
        List<ParameterDefType> parameterDefTypeList = parameterDefTypeRepository.findAll();
        assertThat(parameterDefTypeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchParameterDefType() throws Exception {
        int databaseSizeBeforeUpdate = parameterDefTypeRepository.findAll().size();
        parameterDefType.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restParameterDefTypeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(parameterDefType))
            )
            .andExpect(status().isBadRequest());

        // Validate the ParameterDefType in the database
        List<ParameterDefType> parameterDefTypeList = parameterDefTypeRepository.findAll();
        assertThat(parameterDefTypeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamParameterDefType() throws Exception {
        int databaseSizeBeforeUpdate = parameterDefTypeRepository.findAll().size();
        parameterDefType.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restParameterDefTypeMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(parameterDefType))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ParameterDefType in the database
        List<ParameterDefType> parameterDefTypeList = parameterDefTypeRepository.findAll();
        assertThat(parameterDefTypeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteParameterDefType() throws Exception {
        // Initialize the database
        parameterDefTypeRepository.saveAndFlush(parameterDefType);

        int databaseSizeBeforeDelete = parameterDefTypeRepository.findAll().size();

        // Delete the parameterDefType
        restParameterDefTypeMockMvc
            .perform(delete(ENTITY_API_URL_ID, parameterDefType.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ParameterDefType> parameterDefTypeList = parameterDefTypeRepository.findAll();
        assertThat(parameterDefTypeList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
