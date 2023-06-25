package com.bnppf.alphacredit.repositories.productrepository.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.bnppf.alphacredit.repositories.productrepository.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ExpectedValueTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ExpectedValue.class);
        ExpectedValue expectedValue1 = new ExpectedValue();
        expectedValue1.setId(1L);
        ExpectedValue expectedValue2 = new ExpectedValue();
        expectedValue2.setId(expectedValue1.getId());
        assertThat(expectedValue1).isEqualTo(expectedValue2);
        expectedValue2.setId(2L);
        assertThat(expectedValue1).isNotEqualTo(expectedValue2);
        expectedValue1.setId(null);
        assertThat(expectedValue1).isNotEqualTo(expectedValue2);
    }
}
