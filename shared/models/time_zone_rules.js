var rules = {
  'name': [
    {
      'rule': 'required',
      'error': 'Time Zone name is required.'
    },
    {
      'rule': 'maxLength',
      'args': [50],
      'error': 'The Time Zone name can not be longer than 50 characters.'
    }
  ],
  'cityName': [
    {
      'rule': 'required',
      'error': 'City Name is required.'
    }
  ],
  'gmtOffset': [
    {
      'rule': 'required',
      'error': 'GMT Offset is required.'
    },
    {
      'rule': 'int',
      'error': 'The GMT Offset must be a negative or positive integer.'
    },
    {
      'rule': 'between',
      'args': [-12, 14],
      'error': 'The GMT Offset has to be a valid offset, valid Time Zones go from -12 to 14.'
    }
  ]
};

module.exports = rules;