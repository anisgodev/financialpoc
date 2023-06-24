package com.bnppf.alphacredit.repositories.productrepository.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.bnppf.alphacredit.repositories.productrepository.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ItemGroupTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ItemGroup.class);
        ItemGroup itemGroup1 = new ItemGroup();
        itemGroup1.setId(1L);
        ItemGroup itemGroup2 = new ItemGroup();
        itemGroup2.setId(itemGroup1.getId());
        assertThat(itemGroup1).isEqualTo(itemGroup2);
        itemGroup2.setId(2L);
        assertThat(itemGroup1).isNotEqualTo(itemGroup2);
        itemGroup1.setId(null);
        assertThat(itemGroup1).isNotEqualTo(itemGroup2);
    }
}
