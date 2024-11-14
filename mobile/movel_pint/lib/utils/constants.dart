class CONSTANTS {
  static const String API_BASE_URL = 'http://localhost:8000';
  static const String API_MOBILE_BASE_URL = 'http://10.0.2.2:8000';
  static const String API_MOBILE_CLOUD_URL = 'https://api-vwah.onrender.com';
  //static const String API_MOBILE_CLOUD_URL = 'http://10.0.2.2:8000';

  static const Map<String, Map<String, dynamic>> valores = {
    'EVENTO': {
      'ID': 1,
      'TIPO': 'Evento',
    },
    'ATIVIDADE': {
      'ID': 2,
      'TIPO': 'Atividade',
    },
    'RECOMENDACAO': {
      'ID': 3,
      'TIPO': 'Recomendação',
    },
    'ESPACO': {
      'ID': 4,
      'TIPO': 'Espaço',
    },
  };
}


