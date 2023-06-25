package com.bnppf.alphacredit.repositories.productrepository.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.bnppf.alphacredit.repositories.productrepository.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ProductRepositoryItemTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ProductRepositoryItem.class);
        ProductRepositoryItem productRepositoryItem1 = new ProductRepositoryItem();
        productRepositoryItem1.setId(1L);
        ProductRepositoryItem productRepositoryItem2 = new ProductRepositoryItem();
        productRepositoryItem2.setId(productRepositoryItem1.getId());
        assertThat(productRepositoryItem1).isEqualTo(productRepositoryItem2);
        productRepositoryItem2.setId(2L);
        assertThat(productRepositoryItem1).isNotEqualTo(productRepositoryItem2);
        productRepositoryItem1.setId(null);
        assertThat(productRepositoryItem1).isNotEqualTo(productRepositoryItem2);
    }
}
