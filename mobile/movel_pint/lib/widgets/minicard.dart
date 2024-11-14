import 'package:flutter/material.dart';
import 'package:movel_pint/atividade/detalhes_atividade.dart';

class MiniCard extends StatelessWidget {
  final String imageUrl;
  final String title;
  final Map<String, dynamic> atividade;
  final VoidCallback onTap;

  MiniCard({required this.imageUrl, required this.title, required this.atividade, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => ActivityDetailsPage(activityId: atividade['id']),
          ),
        );
      },
      child: Card(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(10.0),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: 180.0,
              height: 140.0,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(10.0),
                image: DecorationImage(
                  image: NetworkImage(imageUrl),
                  fit: BoxFit.cover,
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: Text(
                _truncateTitle(title),
                style: TextStyle(fontSize: 16.0, fontWeight: FontWeight.bold),
              ),
            ),
          ],
        ),
      ),
    );
  }

  String _truncateTitle(String title) {
    const maxLength = 19; 
    if (title.length <= maxLength) {
      return title;
    } else {
      int lastSpaceIndex = title.substring(0, maxLength).lastIndexOf(' ');
      return '${title.substring(0, lastSpaceIndex)}...';
    }
  }
}
