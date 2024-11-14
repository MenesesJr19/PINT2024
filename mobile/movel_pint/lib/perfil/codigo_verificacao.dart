/*import 'package:flutter/material.dart';
import 'nova_senha.dart'; // Importe o arquivo onde está definida a NovaSenhaPage

class CodigoVerificacaoPage extends StatefulWidget {
  final String email;

  CodigoVerificacaoPage({required this.email});

  @override
  _CodigoVerificacaoPageState createState() => _CodigoVerificacaoPageState();
}

class _CodigoVerificacaoPageState extends State<CodigoVerificacaoPage> {
  final _formKey = GlobalKey<FormState>();
  late TextEditingController _codigoController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _codigoController = TextEditingController();
  }

  @override
  void dispose() {
    _codigoController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: const Color.fromRGBO(57, 99, 156, 1.0),
        title: Text('Código de Verificação'),
      ),
      body: Container(
        color: const Color.fromRGBO(57, 99, 156, 1.0),
        child: Center(
          child: Container(
            padding: EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(10),
            ),
            child: Form(
              key: _formKey,
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: <Widget>[
                  const Padding(
                    padding: EdgeInsets.only(
                      left: 10,
                      bottom: 20,
                      top: 40,
                    ),
                    child: Align(
                      alignment: Alignment.centerLeft,
                      child: Text(
                        'Código de Verificação',
                        style: TextStyle(
                          fontSize: 30,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
                  SizedBox(height: 10),
                  TextFormField(
                    controller: _codigoController,
                    keyboardType: TextInputType.number,
                    decoration: InputDecoration(
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(10.0),
                      ),
                      labelText: 'Código',
                      prefixIcon: Icon(Icons.confirmation_number),
                    ),
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Por favor, informe o código recebido';
                      }
                      return null;
                    },
                  ),
                  SizedBox(height: 20),
                  Container(
                    width: double.infinity,
                    child: ElevatedButton(
                      style: ButtonStyle(
                        backgroundColor: MaterialStateProperty.all<Color>(
                            Color.fromRGBO(57, 99, 156, 1.0)),
                      ),
                      onPressed: () {
                        if (_formKey.currentState!.validate()) {
                          _handleVerificationCode();
                        }
                      },
                      child: Text(
                        'Verificar',
                        style: TextStyle(
                          color: Colors.white,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  void _handleVerificationCode() {
    final codigo = _codigoController.text;
    // Aqui você pode adicionar lógica para verificar o código recebido
    if (codigo == '1234') {
      // Se o código for válido, navegue para a página NovaSenhaPage
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => NovaSenhaPage(email: widget.email),
        ),
      );
    } else {
      // Caso contrário, exiba uma mensagem de erro
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Código incorreto. Por favor, tente novamente.'),
          duration: Duration(seconds: 3),
        ),
      );
    }
  }
}
*/
