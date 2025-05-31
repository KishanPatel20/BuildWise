from django import forms
from allauth.account.forms import SignupForm

class CustomSignupForm(SignupForm):
    first_name = forms.CharField(max_length=30, label='First Name')
    last_name = forms.CharField(max_length=30, label='Last Name')

    # This __init__ method is crucial if you include one.
    # It correctly accepts 'request' and passes it, along with other args/kwargs,
    # to the parent SignupForm's __init__ method.
    def __init__(self, *args, **kwargs):
        # SignupForm's __init__ expects 'request' as its first positional argument.
        # allauth will pass 'request' as the first argument, and then other args/kwargs.
        # So, we retrieve 'request' from kwargs or args depending on how it's passed
        # and then pass it explicitly.

        # The standard way to handle 'request' with allauth custom forms:
        self.request = kwargs.pop('request', None) # Get request from kwargs if present (common pattern)
        if self.request is None and len(args) > 0 and isinstance(args[0], type(self.request)): # Check if request is first positional arg
            self.request = args[0]
            args = args[1:] # Consume the request from args

        super().__init__(*args, **kwargs) # Call the parent's __init__

        # If you needed to do something with self.request here, you can.
        # For example, to filter choices based on the request user.

    def save(self, request):
        # The 'request' here is automatically passed by allauth's view when save is called.
        user = super(CustomSignupForm, self).save(request)
        user.first_name = self.cleaned_data['first_name']
        user.last_name = self.cleaned_data['last_name']
        user.save()
        return user