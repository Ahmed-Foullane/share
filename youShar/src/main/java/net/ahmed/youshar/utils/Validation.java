package net.ahmed.youshar.utils;

import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;

import java.util.HashMap;
import java.util.Map;

public class Validation {
    public static Map<String, String> getValidationErrors(BindingResult result) {
        Map<String, String> errorsMap = new HashMap<>();
        for (var error : result.getAllErrors()) {
            var fieldError = (FieldError) error;
            errorsMap.put(fieldError.getField(), fieldError.getDefaultMessage());
        }
        return errorsMap;
    }
}
