package com.bnppf.alphacredit.repositories.productrepository.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.bnppf.alphacredit.repositories.productrepository.IntegrationTest;
import com.bnppf.alphacredit.repositories.productrepository.domain.ItemGroup;
import com.bnppf.alphacredit.repositories.productrepository.repository.ItemGroupRepository;
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
 * Integration tests for the {@link ItemGroupResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ItemGroupResourceIT {

    private static final String DEFAULT_ITEM_GROUP_NAME = "AAAAAAAAAA";
    private static final String UPDATED_ITEM_GROUP_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_ITEM_GROUP_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_ITEM_GROUP_DESCRIPTION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/item-groups";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ItemGroupRepository itemGroupRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restItemGroupMockMvc;

    private ItemGroup itemGroup;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ItemGroup createEntity(EntityManager em) {
        ItemGroup itemGroup = new ItemGroup().itemGroupName(DEFAULT_ITEM_GROUP_NAME).itemGroupDescription(DEFAULT_ITEM_GROUP_DESCRIPTION);
        return itemGroup;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ItemGroup createUpdatedEntity(EntityManager em) {
        ItemGroup itemGroup = new ItemGroup().itemGroupName(UPDATED_ITEM_GROUP_NAME).itemGroupDescription(UPDATED_ITEM_GROUP_DESCRIPTION);
        return itemGroup;
    }

    @BeforeEach
    public void initTest() {
        itemGroup = createEntity(em);
    }

    @Test
    @Transactional
    void createItemGroup() throws Exception {
        int databaseSizeBeforeCreate = itemGroupRepository.findAll().size();
        // Create the ItemGroup
        restItemGroupMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(itemGroup)))
            .andExpect(status().isCreated());

        // Validate the ItemGroup in the database
        List<ItemGroup> itemGroupList = itemGroupRepository.findAll();
        assertThat(itemGroupList).hasSize(databaseSizeBeforeCreate + 1);
        ItemGroup testItemGroup = itemGroupList.get(itemGroupList.size() - 1);
        assertThat(testItemGroup.getItemGroupName()).isEqualTo(DEFAULT_ITEM_GROUP_NAME);
        assertThat(testItemGroup.getItemGroupDescription()).isEqualTo(DEFAULT_ITEM_GROUP_DESCRIPTION);
    }

    @Test
    @Transactional
    void createItemGroupWithExistingId() throws Exception {
        // Create the ItemGroup with an existing ID
        itemGroup.setId(1L);

        int databaseSizeBeforeCreate = itemGroupRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restItemGroupMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(itemGroup)))
            .andExpect(status().isBadRequest());

        // Validate the ItemGroup in the database
        List<ItemGroup> itemGroupList = itemGroupRepository.findAll();
        assertThat(itemGroupList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllItemGroups() throws Exception {
        // Initialize the database
        itemGroupRepository.saveAndFlush(itemGroup);

        // Get all the itemGroupList
        restItemGroupMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(itemGroup.getId().intValue())))
            .andExpect(jsonPath("$.[*].itemGroupName").value(hasItem(DEFAULT_ITEM_GROUP_NAME)))
            .andExpect(jsonPath("$.[*].itemGroupDescription").value(hasItem(DEFAULT_ITEM_GROUP_DESCRIPTION)));
    }

    @Test
    @Transactional
    void getItemGroup() throws Exception {
        // Initialize the database
        itemGroupRepository.saveAndFlush(itemGroup);

        // Get the itemGroup
        restItemGroupMockMvc
            .perform(get(ENTITY_API_URL_ID, itemGroup.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(itemGroup.getId().intValue()))
            .andExpect(jsonPath("$.itemGroupName").value(DEFAULT_ITEM_GROUP_NAME))
            .andExpect(jsonPath("$.itemGroupDescription").value(DEFAULT_ITEM_GROUP_DESCRIPTION));
    }

    @Test
    @Transactional
    void getNonExistingItemGroup() throws Exception {
        // Get the itemGroup
        restItemGroupMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingItemGroup() throws Exception {
        // Initialize the database
        itemGroupRepository.saveAndFlush(itemGroup);

        int databaseSizeBeforeUpdate = itemGroupRepository.findAll().size();

        // Update the itemGroup
        ItemGroup updatedItemGroup = itemGroupRepository.findById(itemGroup.getId()).get();
        // Disconnect from session so that the updates on updatedItemGroup are not directly saved in db
        em.detach(updatedItemGroup);
        updatedItemGroup.itemGroupName(UPDATED_ITEM_GROUP_NAME).itemGroupDescription(UPDATED_ITEM_GROUP_DESCRIPTION);

        restItemGroupMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedItemGroup.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedItemGroup))
            )
            .andExpect(status().isOk());

        // Validate the ItemGroup in the database
        List<ItemGroup> itemGroupList = itemGroupRepository.findAll();
        assertThat(itemGroupList).hasSize(databaseSizeBeforeUpdate);
        ItemGroup testItemGroup = itemGroupList.get(itemGroupList.size() - 1);
        assertThat(testItemGroup.getItemGroupName()).isEqualTo(UPDATED_ITEM_GROUP_NAME);
        assertThat(testItemGroup.getItemGroupDescription()).isEqualTo(UPDATED_ITEM_GROUP_DESCRIPTION);
    }

    @Test
    @Transactional
    void putNonExistingItemGroup() throws Exception {
        int databaseSizeBeforeUpdate = itemGroupRepository.findAll().size();
        itemGroup.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restItemGroupMockMvc
            .perform(
                put(ENTITY_API_URL_ID, itemGroup.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(itemGroup))
            )
            .andExpect(status().isBadRequest());

        // Validate the ItemGroup in the database
        List<ItemGroup> itemGroupList = itemGroupRepository.findAll();
        assertThat(itemGroupList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchItemGroup() throws Exception {
        int databaseSizeBeforeUpdate = itemGroupRepository.findAll().size();
        itemGroup.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restItemGroupMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(itemGroup))
            )
            .andExpect(status().isBadRequest());

        // Validate the ItemGroup in the database
        List<ItemGroup> itemGroupList = itemGroupRepository.findAll();
        assertThat(itemGroupList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamItemGroup() throws Exception {
        int databaseSizeBeforeUpdate = itemGroupRepository.findAll().size();
        itemGroup.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restItemGroupMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(itemGroup)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ItemGroup in the database
        List<ItemGroup> itemGroupList = itemGroupRepository.findAll();
        assertThat(itemGroupList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateItemGroupWithPatch() throws Exception {
        // Initialize the database
        itemGroupRepository.saveAndFlush(itemGroup);

        int databaseSizeBeforeUpdate = itemGroupRepository.findAll().size();

        // Update the itemGroup using partial update
        ItemGroup partialUpdatedItemGroup = new ItemGroup();
        partialUpdatedItemGroup.setId(itemGroup.getId());

        partialUpdatedItemGroup.itemGroupName(UPDATED_ITEM_GROUP_NAME);

        restItemGroupMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedItemGroup.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedItemGroup))
            )
            .andExpect(status().isOk());

        // Validate the ItemGroup in the database
        List<ItemGroup> itemGroupList = itemGroupRepository.findAll();
        assertThat(itemGroupList).hasSize(databaseSizeBeforeUpdate);
        ItemGroup testItemGroup = itemGroupList.get(itemGroupList.size() - 1);
        assertThat(testItemGroup.getItemGroupName()).isEqualTo(UPDATED_ITEM_GROUP_NAME);
        assertThat(testItemGroup.getItemGroupDescription()).isEqualTo(DEFAULT_ITEM_GROUP_DESCRIPTION);
    }

    @Test
    @Transactional
    void fullUpdateItemGroupWithPatch() throws Exception {
        // Initialize the database
        itemGroupRepository.saveAndFlush(itemGroup);

        int databaseSizeBeforeUpdate = itemGroupRepository.findAll().size();

        // Update the itemGroup using partial update
        ItemGroup partialUpdatedItemGroup = new ItemGroup();
        partialUpdatedItemGroup.setId(itemGroup.getId());

        partialUpdatedItemGroup.itemGroupName(UPDATED_ITEM_GROUP_NAME).itemGroupDescription(UPDATED_ITEM_GROUP_DESCRIPTION);

        restItemGroupMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedItemGroup.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedItemGroup))
            )
            .andExpect(status().isOk());

        // Validate the ItemGroup in the database
        List<ItemGroup> itemGroupList = itemGroupRepository.findAll();
        assertThat(itemGroupList).hasSize(databaseSizeBeforeUpdate);
        ItemGroup testItemGroup = itemGroupList.get(itemGroupList.size() - 1);
        assertThat(testItemGroup.getItemGroupName()).isEqualTo(UPDATED_ITEM_GROUP_NAME);
        assertThat(testItemGroup.getItemGroupDescription()).isEqualTo(UPDATED_ITEM_GROUP_DESCRIPTION);
    }

    @Test
    @Transactional
    void patchNonExistingItemGroup() throws Exception {
        int databaseSizeBeforeUpdate = itemGroupRepository.findAll().size();
        itemGroup.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restItemGroupMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, itemGroup.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(itemGroup))
            )
            .andExpect(status().isBadRequest());

        // Validate the ItemGroup in the database
        List<ItemGroup> itemGroupList = itemGroupRepository.findAll();
        assertThat(itemGroupList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchItemGroup() throws Exception {
        int databaseSizeBeforeUpdate = itemGroupRepository.findAll().size();
        itemGroup.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restItemGroupMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(itemGroup))
            )
            .andExpect(status().isBadRequest());

        // Validate the ItemGroup in the database
        List<ItemGroup> itemGroupList = itemGroupRepository.findAll();
        assertThat(itemGroupList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamItemGroup() throws Exception {
        int databaseSizeBeforeUpdate = itemGroupRepository.findAll().size();
        itemGroup.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restItemGroupMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(itemGroup))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ItemGroup in the database
        List<ItemGroup> itemGroupList = itemGroupRepository.findAll();
        assertThat(itemGroupList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteItemGroup() throws Exception {
        // Initialize the database
        itemGroupRepository.saveAndFlush(itemGroup);

        int databaseSizeBeforeDelete = itemGroupRepository.findAll().size();

        // Delete the itemGroup
        restItemGroupMockMvc
            .perform(delete(ENTITY_API_URL_ID, itemGroup.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ItemGroup> itemGroupList = itemGroupRepository.findAll();
        assertThat(itemGroupList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
