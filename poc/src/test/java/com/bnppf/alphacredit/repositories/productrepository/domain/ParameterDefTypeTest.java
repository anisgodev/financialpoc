package com.bnppf.alphacredit.repositories.productrepository.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.bnppf.alphacredit.repositories.productrepository.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ParameterDefTypeTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ParameterDefType.class);
        ParameterDefType parameterDefType1 = new ParameterDefType();
        parameterDefType1.setId(1L);
        ParameterDefType parameterDefType2 = new ParameterDefType();
        parameterDefType2.setId(parameterDefType1.getId());
        assertThat(parameterDefType1).isEqualTo(parameterDefType2);
        parameterDefType2.setId(2L);
        assertThat(parameterDefType1).isNotEqualTo(parameterDefType2);
        parameterDefType1.setId(null);
        assertThat(parameterDefType1).isNotEqualTo(parameterDefType2);
    }
}
