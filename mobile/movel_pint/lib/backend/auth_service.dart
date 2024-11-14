import 'package:movel_pint/backend/myHttp.dart';
import 'package:movel_pint/utils/user_preferences.dart';

class AuthService {
  static Future<dynamic> obter() async {
    const url = 'autenticacao/obter';
    try {
      String token = acessarToken();
      return await myHttp(url: url, method: "GET", headers: { "Authorization": "Bearer $token" },);
    } catch (e) {
      throw Exception('Failed to connect to server: $e');
    }
  }

  static String acessarToken() {
    String? authToken = UserPreferences().authToken;
    if (authToken != null) {
      return authToken;
    } else {
      return "";
    }
  }
}