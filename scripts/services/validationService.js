define(['bootstrapValidator'], function (bootstrapValidator) {

    var getBootstrapValidator = function (formId) {
        //formId: the name of the form element that will be validated
        //bsValidator is a jQuery representation of the form object after bsvalidator has been created on its data attribute
        //bsValidator.data('bootstrapValidator') returns the object that will allow you to work directly with the validation components
        var bsValidator = $('#' + formId).bootstrapValidator({
            container: '#optionsMessages'
        });
        return bsValidator.data('bootstrapValidator');
    };

    var addValidator = function (validatorObject, field, dataObject) {
        validatorObject.addField(field);
        validatorObject.options.fields[field].validators.lessThan = dataObject;
    };

    var updateValidator = function (validatorObject, field, dataObject) {
        validatorObject.options.fields[field].validators.lessThan = dataObject;
    };

    var createValidationDataObject = function (value, message, inclusive) {

        message = message.concat(" ").concat(value.toString());
        return {
            value: value.toString(), //string
            message: message,        //string
            inclusive: inclusive     //bool
        };
    }

    return {
        getBootstrapValidator: getBootstrapValidator,
        addValidator: addValidator,
        updateValidator: updateValidator,
        createValidationDataObject: createValidationDataObject
    };

});