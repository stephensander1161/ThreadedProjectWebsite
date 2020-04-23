/*  Coded by Chi
    Source: http://bootstrapvalidator.votintsev.ru/settings/ 
*/

$(document).ready(function () {

    // http://bootstrapvalidator.votintsev.ru/settings/ for more info check this out.    
  $('#myForm').bootstrapValidator({
      // To use feedback icons, ensure that you use Bootstrap v3.1.0 or later
      feedbackIcons: {
          valid: 'glyphicon glyphicon-ok',
          invalid: 'glyphicon glyphicon-remove',
          validating: 'glyphicon glyphicon-refresh'
      },
      fields: {
          first_name: {
              validators: {
                  stringLength: {
                      min: 2,
                  },
                  notEmpty: {
                      message: 'Please enter your first name'
                  }
              }
          },
          last_name: {
              validators: {
                  stringLength: {
                      min: 2,
                  },
                  notEmpty: {
                      message: 'Please enter your last name'
                  }
              }
          },
          email: {
              validators: {
                  notEmpty: {
                      message: 'Please enter your email address'
                  },
                  emailAddress: {
                      message: 'Email address is not valid'
                  }
              }
          },
          password: {
            validators: {
                  notEmpty: {
                      message: 'The password is required and cannot be empty'
                  },
                  stringLength: {
                      min: 8,
                      message: 'The password must have at least 8 characters'
                  }
              }
          },
          phone: {
              validators: {
                //   notEmpty: {
                //       message: 'Please enter your phone number'
                //   },
                  phone: {
                      country: 'US',
                      message: 'Please enter a vaild phone number with area code'
                  }
              }
          },
          address: {
              validators: {
                  stringLength: {
                      min: 8,
                  },
                //   notEmpty: {
                //       message: 'Please enter your street address'
                //   }
              }
          },
          city: {
              validators: {
                  stringLength: {
                      min: 4,
                  },
                //   notEmpty: {
                //       message: 'Please enter your city'
                //   }
              }
          },
          country: {
              validators: {
                  stringLength: {
                      min: 2,
                  },
                //   notEmpty: {
                //       message: 'Please select your country'
                //   }
              }
          },
          province: {
              validators: {
                //   notEmpty: {
                //       message: 'Please select your province'
                //   }
              }
          },
          pCode: {
              validators: {
                //   notEmpty: {
                //       message: 'Please enter your postal code'
                //   },
                  zipCode: {
                      country: 'countrySelect',
                      message: 'This is not a vaild %s code'
                  }
              }
          },
      }
  }).on('success.form.bv', function (e) {
        $('#success_message').slideDown({ opacity: "show" }, "slow") // Do something ...
        $('#myForm').data('bootstrapValidator').resetForm();

        // Prevent form submission
        e.preventDefault();

        // Get the form instance
        var $form = $(e.target);

        // Get the BootstrapValidator instance
        var bv = $form.data('bootstrapValidator');

        // Use Ajax to submit form data
        $.post($form.attr('action'), $form.serialize(), function (result) {
            console.log(result);
        }, 'json');
        
        setTimeout(() => {
            window.location.replace("/login");
        }, 5000);
    });
});

