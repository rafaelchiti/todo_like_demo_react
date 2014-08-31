var rules = {
    'username': [
        {
            'rule': 'required',
            'error': 'Email field is required.'
        },
        {
            'rule': 'email',
            'error': 'You must provide a valid email as username.'
        },
    ],
    'password': [
        {
            'rule': 'required',
            'error': 'The password is required'
        }
    ]
};

module.exports = rules;