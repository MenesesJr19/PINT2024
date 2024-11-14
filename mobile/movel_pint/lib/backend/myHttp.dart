import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:movel_pint/backend/auth_service.dart';
import 'package:movel_pint/utils/constants.dart';

const String baseUrl = CONSTANTS.API_MOBILE_CLOUD_URL;


Future<dynamic> myHttp({
  required String url,
  required String method,
  dynamic data = const {},
  Map<String, String> headers = const {},
}) async {
  try {
    url = "$baseUrl/$url";

    final modifiableHeaders = Map<String, String>.from(headers ?? {});

    String token = AuthService.acessarToken();   
    if (token != "") modifiableHeaders['Authorization'] = 'Bearer $token';

    print('$url $method $headers $data');
    http.Response response;
    if (method == 'GET') {
      response = await http.get(Uri.parse(url), headers: modifiableHeaders);
    } else if (method == 'POST') {
      print("oi $data ${data.runtimeType}");
      response = await http.post(Uri.parse(url), headers: modifiableHeaders, body: data);
    } else if (method == 'PUT') {
      response = await http.put(Uri.parse(url), headers: modifiableHeaders, body: data);
    } else if (method == 'DELETE') {
      response = await http.delete(Uri.parse(url), headers: modifiableHeaders);
    } else {
      throw Exception('Método HTTP não suportado: $method');
    }
    print(response.statusCode);

    if (response.statusCode == 200) {
      dynamic responseData = json.decode(response.body);
      if (responseData['success']) {
        return responseData['data'];
      } else {
        return null;
      }
    } else {
      throw Exception('Falha na requisição: ${response.statusCode}');
    }
  } catch (error) {
    print('Erro na requisição: $error');
    return null;
  }
}
