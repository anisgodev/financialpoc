package com.bnppf.alphacredit.repositories.productrepository.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.bnppf.alphacredit.repositories.productrepository.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ItemFeatureTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ItemFeature.class);
        ItemFeature itemFeature1 = new ItemFeature();
        itemFeature1.setId(1L);
        ItemFeature itemFeature2 = new ItemFeature();
        itemFeature2.setId(itemFeature1.getId());
        assertThat(itemFeature1).isEqualTo(itemFeature2);
        itemFeature2.setId(2L);
        assertThat(itemFeature1).isNotEqualTo(itemFeature2);
        itemFeature1.setId(null);
        assertThat(itemFeature1).isNotEqualTo(itemFeature2);
    }
}
