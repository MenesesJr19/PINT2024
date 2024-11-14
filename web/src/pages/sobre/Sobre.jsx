import { Texto } from "components";
import { FilePresentation } from "components/common/filePresentation/FilePresentation";

// Ficheiros
import Video from "assets/microsite/Video.mp4";
import Relatorio from "assets/microsite/Relatório.pdf";
import Credenciais from "assets/microsite/Credenciais.pdf";
import MobileApk from "assets/microsite/app-release.apk";

// Icones
import PDFIcon from "assets/microsite/icons/pdf-icon.png";
import AndroidIcon from "assets/microsite/icons/android-icon.png";
import WebsiteIcon from "assets/microsite/icons/website-icon.png";
import CredenciaisIcon from "assets/microsite/icons/credenciais-icon.png";
import MP4Icon from "assets/microsite/icons/mp4-icon.png";

export function Sobre() {
	return (
		<article>
			<Texto className="mt-4" size={5}>
				Ficheiros
			</Texto>
			<section className="mt-3">
				<FilePresentation path={"/"} displayName="Website" icon={WebsiteIcon} />
			</section>
			<section className="mt-3">
				<FilePresentation path={MobileApk} displayName="Aplicação móvel" icon={AndroidIcon} />
			</section>
			<section className="mt-3">
				<FilePresentation path={Relatorio} displayName="Relatório" icon={PDFIcon} />
			</section>
			<section className="mt-3">
				<FilePresentation path={Video} displayName="Vídeo" icon={MP4Icon} />
			</section>
			<section className="mt-3">
				<FilePresentation path={Credenciais} displayName="Credenciais" icon={CredenciaisIcon} />
			</section>
		</article>
	);
}
