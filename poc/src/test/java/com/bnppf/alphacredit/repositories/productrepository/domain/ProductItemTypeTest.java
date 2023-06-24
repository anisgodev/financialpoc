package com.bnppf.alphacredit.repositories.productrepository.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.bnppf.alphacredit.repositories.productrepository.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ProductItemTypeTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ProductItemType.class);
        ProductItemType productItemType1 = new ProductItemType();
        productItemType1.setId(1L);
        ProductItemType productItemType2 = new ProductItemType();
        productItemType2.setId(productItemType1.getId());
        assertThat(productItemType1).isEqualTo(productItemType2);
        productItemType2.setId(2L);
        assertThat(productItemType1).isNotEqualTo(productItemType2);
        productItemType1.setId(null);
        assertThat(productItemType1).isNotEqualTo(productItemType2);
    }
}
