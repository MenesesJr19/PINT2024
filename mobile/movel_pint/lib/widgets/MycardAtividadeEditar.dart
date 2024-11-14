import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:movel_pint/atividade/detalhes_atividade.dart';
import 'package:movel_pint/atividade/editarAtividade.dart'; 

class MyCardAtividadeComEditar extends StatelessWidget {
  final Map<String, dynamic> atividade;
  final VoidCallback onTap;

  MyCardAtividadeComEditar({
    required this.atividade,
    required this.onTap, required Null Function() onEdit,
  });

  String formatDateTime(String dateTime) {
    final DateTime parsedDateTime = DateTime.parse(dateTime);
    final DateFormat formatter = DateFormat('dd/MM/yyyy HH:mm');
    return formatter.format(parsedDateTime);
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
      child: GestureDetector(
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => ActivityDetailsPage(activityId: atividade['id']),
            ),
          );
        },
        child: Card(
          elevation: 3,
          color: Colors.white,
          child: Stack(
            children: [
              Padding(
                padding: const EdgeInsets.all(12.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        CircleAvatar(
                          radius: 24,
                          backgroundImage: atividade['conteudo_utilizador']['imagem'] != null
                              ? NetworkImage(atividade['conteudo_utilizador']['imagem'])
                              : AssetImage('assets/Images/imageMissing.jpg') as ImageProvider,
                        ),
                        SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                '${atividade['conteudo_utilizador']['nome']} ${atividade['conteudo_utilizador']['sobrenome']}',
                              ),
                              Text(
                                '${atividade['data_criacao'] != null ? formatDateTime(atividade['data_criacao']) : ''}',
                                style: TextStyle(
                                  fontSize: 12,
                                  color: Colors.grey,
                                ),
                              ),
                              SizedBox(height: 2),
                            ],
                          ),
                        ),
                        SizedBox(width: 8),
                        IconButton(
                          icon: Icon(Icons.edit),
                          onPressed: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => EditActivityPage(atividade: atividade),
                              ),
                            );
                          },
                        ),
                      ],
                    ),
                    SizedBox(height: 8),
                    ListTile(
                      title: Text(
                        atividade['titulo'] ?? 'Título da atividade',
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 18,
                          color: Colors.black,
                        ),
                      ),
                      subtitle: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          if (atividade['data_evento'] != null)
                            Text(
                              formatDateTime(atividade['data_evento']),
                            ),
                          Text(
                            '${atividade['endereco'] ?? ''}',
                          ),
                        ],
                      ),
                      trailing: SizedBox.shrink(),
                    ),
                    SizedBox(height: 8),
                    Center(
                      child: Container(
                        width: 400,
                        height: 150,
                        decoration: BoxDecoration(
                          image: DecorationImage(
                            image: atividade['imagem'] != null
                                ? NetworkImage(atividade['imagem'])
                                : AssetImage('assets/Images/imageMissing.jpg') as ImageProvider,
                            fit: BoxFit.cover,
                          ),
                        ),
                      ),
                    ),
                    SizedBox(height: 12),
                    Align(
                      alignment: Alignment.centerRight,
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          _buildIconWithCount(Icons.photo_library_outlined,
                              atividade['album_conteudo']?.length.toString() ?? '0'),
                          SizedBox(width: 20),
                          _buildIconWithCount(Icons.comment_outlined,
                              atividade['comentario_conteudo']?.length.toString() ?? '0'),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildIconWithCount(IconData iconData, String count) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(iconData),
        SizedBox(width: 3),
        Text(
          count,
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
      ],
    );
  }
}
