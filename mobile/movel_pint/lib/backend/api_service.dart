import 'dart:convert';
import 'dart:typed_data';
import 'package:http/http.dart' as http;
import 'package:movel_pint/backend/myHttp.dart';
import 'package:movel_pint/utils/constants.dart';
import 'package:http_parser/http_parser.dart';  // Adicione essa linha


const String baseUrl = CONSTANTS.API_MOBILE_CLOUD_URL;

class ApiService {

  static Future<dynamic> obter(String endpoint, int id, {Map<String, String> headers = const {}}) async {
    final url = '$endpoint/obter/$id';
    try {
      return await myHttp(url: url, method: "GET", headers: headers);
    } catch (e) {
      throw Exception('Failed to connect to server: $e');
    }
  }

  static Future<dynamic> listar(String endpoint, {Map<String, String> headers = const {}, dynamic data}) async {
    final url = '$endpoint/listar';
    try {
      return await myHttp(url: url, method: "POST", headers: headers, data: jsonEncode(data));
    } catch (e) {
      throw Exception('Failed to connect to server: $e');
    }
  }

  static Future<http.Response> criarFormDataArray(String endpoint, {Map<String, dynamic> data = const {}, String fileKey = "imagem", List<Uint8List> files = const [], Map<String, dynamic> headers = const {}}) async {
    try {
      var url = Uri.parse('$baseUrl/$endpoint/criar');
      var request = http.MultipartRequest('POST', url);

      data.forEach((key, value) {
        request.fields[key] = value.toString();
      });

      for (var i = 0; i < files.length; i++) {
        var arquivoMultipart = http.MultipartFile.fromBytes(
          fileKey, 
          files[i],
          filename: 'upload_$i.jpg', 
        );
        request.files.add(arquivoMultipart);
      }

      headers.forEach((key, value) {
        request.headers[key] = value.toString();
      });

      var response = await http.Response.fromStream(await request.send());

      return response;
    } catch (error) {
      throw error;
    }
  }

  static Future<dynamic> criar(String endpoint, {Map<String, String> headers = const {}, dynamic data}) async {
    final url = '$endpoint/criar';
    try {
      return await myHttp(url: url, method: "POST", headers: headers, data: jsonEncode(data));
    } catch (e) {
      throw Exception('Failed to connect to server: $e');
    }
  }

  static Future<dynamic> externalLogin(String token) async {
    final url = 'autenticacao/external-login';
    try {
      final Map<String, String> body = { 'token': token };
      return await myHttp(url: url, method: "POST", data: body);
    } catch (e) {
      throw Exception('Falha na autenticação: ${e.toString()}');
    }
  }

  static Future<dynamic> githubLogin(String? photoURL, String? displayName, String? email) async {
    final url = 'autenticacao/github-login';
    try {
      final Map<String, String> body = { 'photoUrl': photoURL!, 'displayName': displayName!, 'email': email! };
      return await myHttp(url: url, method: "POST", data: body);
    } catch (e) {
      throw Exception('Falha na autenticação: ${e.toString()}');
    }
  }


  static Future<dynamic> criarFormDataFile(String endpoint, {required Map<String, String> data, required String fileKey, required Uint8List file}) async {
    var uri = Uri.parse('$baseUrl/$endpoint');
    var request = http.MultipartRequest('POST', uri);

    // Adicionar os campos
    data.forEach((key, value) {
      request.fields[key] = value;
    });

    // Adicionar o arquivo como MultipartFile
    request.files.add(http.MultipartFile.fromBytes(
      fileKey,
      file,
      filename: 'upload.png', // Nome do arquivo
      contentType: MediaType('image', 'png'), // Tipo de conteúdo
    ));

    // Enviar o request
    var response = await request.send();

    if (response.statusCode == 200) {
      return jsonDecode(await response.stream.bytesToString());
    } else {
      print('Erro ao enviar dados: ${response.statusCode}');
      return null;
    }
  }

  static Future<dynamic> criarFormData(String endpoint, {required Map<String, dynamic> data, required String fileKey}) async {
    var uri = Uri.parse('$baseUrl/$endpoint');
    var request = http.MultipartRequest('POST', uri);

    // Adicionar os campos (exceto o campo de imagem)
    data.forEach((key, value) {
      if (key != fileKey) {
        request.fields[key] = value.toString();
      }
    });

    // Tratar o arquivo de imagem como Uint8List
    if (data.containsKey(fileKey)) {
      Uint8List fileData = data[fileKey];
      request.files.add(http.MultipartFile.fromBytes(
        fileKey,
        fileData,
        filename: 'upload.png', // Nome do arquivo (pode ser alterado)
        contentType: MediaType('image', 'png'), // Tipo de conteúdo
      ));
    }

    // Enviar a requisição
    var response = await request.send();

    if (response.statusCode == 200) {
      // Decodificar a resposta JSON
      return jsonDecode(await response.stream.bytesToString());
    } else {
      print('Erro ao enviar dados: ${response.statusCode}');
      return null;
    }
  }

  static Future<void> atualizar(String endpoint, int id, {Map<String, String>? headers, dynamic data}) async {
    final url = '$endpoint/atualizar/$id';
    try {
      final response = await http.put(
        Uri.parse('$baseUrl/$url'),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
          ...?headers,
        },
        body: jsonEncode(data),
      );
      if (response.statusCode == 200) {
        print('Recurso atualizado com sucesso');
      } else {
        throw Exception('Falha ao atualizar recurso: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Erro na conexão com o servidor: $e');
    }
  }

static Future<http.Response> sendProfilePic(
  String endpoint, {
  required Uint8List fileData,
  required String fileKey,
  Map<String, String> headers = const {},
}) async {
  try {
    var url = Uri.parse('$baseUrl/$endpoint');
    var request = http.MultipartRequest('PUT', url);

    // Adicionar o arquivo ao request
    var arquivoMultipart = http.MultipartFile.fromBytes(
      fileKey,
      fileData,
      filename: 'upload.jpg',
    );

    request.files.add(arquivoMultipart);

    // Adicionar headers ao request
    headers.forEach((key, value) {
      request.headers[key] = value;
    });

    // Enviar o request e obter a resposta
    var response = await http.Response.fromStream(await request.send());

    return response;
  } catch (error) {
    throw error;
  }
}

  static Future<void> remover(String endpoint, int id, {Map<String, String>? headers}) async {
    final url = '$endpoint/remover/$id';
    try {
      final response = await http.delete(
        Uri.parse('$baseUrl/$url'),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
          ...?headers,
        },
      );
      if (response.statusCode == 200) {
        print('Recurso removido com sucesso');
      } else {
        throw Exception('Falha ao remover recurso: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Erro na conexão com o servidor: $e');
    }
  }

  static Future<Map<String, dynamic>?> postData(String endpoint, Map<String, dynamic> data) async {
  try {

    final response = await http.post(
      Uri.parse('$baseUrl/$endpoint'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode(data),
    );

    if (response.statusCode >= 200 && response.statusCode < 300) {
      // Verifica se o corpo da resposta pode ser decodificado como JSON
      try {
        return json.decode(response.body) as Map<String, dynamic>?;
      } catch (e) {
        throw Exception('Erro ao decodificar resposta da API: ${response.body}');
      }
    } else {
      // Inclui mais informações sobre a falha
      throw Exception('Falha ao enviar dados para a API. Status code: ${response.statusCode}, Resposta: ${response.body}');
    }
  } catch (e) {
    throw Exception('Erro na comunicação com a API: $e');
  }
}


  static Future<void> updateProfile(Map<String, dynamic> profileData) async {
    final String endpoint = 'utilizador/atualizar/${profileData['id']}';
    try {
      final response = await http.put(
        Uri.parse('$baseUrl/$endpoint'),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: jsonEncode(profileData),
      );

      if (response.statusCode == 200) {
        print('Perfil atualizado com sucesso');
      } else {
        throw Exception('Falha ao atualizar perfil: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Erro na conexão com o servidor: $e');
    }
  }

  static Future<Map<String, dynamic>?> putData(String endpoint, Map<String, dynamic> data) async {
    try {
      final response = await http.put(
        Uri.parse('$baseUrl/$endpoint'),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: jsonEncode(data),
      );
      if (response.statusCode == 200) {
        return json.decode(response.body);
      } else {
        throw Exception('Erro ao atualizar dados: ${response.statusCode}');
      }
    } catch (e) {
      print('Erro ao atualizar dados: $e');
      throw Exception('Erro ao atualizar dados');
    }
  }

  static Future<void> deleteData(String endpoint) async {
    try {
      final response = await http.delete(
        Uri.parse('$baseUrl/$endpoint'),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
        },
      );
      if (response.statusCode == 200) {
        print('Dados removidos com sucesso');
      } else {
        throw Exception('Erro ao remover dados: ${response.statusCode}');
      }
    } catch (e) {
      print('Erro ao remover dados: $e');
      throw Exception('Erro ao remover dados');
    }
  }
}
