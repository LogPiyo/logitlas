import Image from "next/image";
import styles from "./page.module.css";
import Footer from "./components/Footer";

export default function Home() {
  const currentYear = new Date().getFullYear();
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Image
          className={styles.logo}
          src="/titleLogo.svg"
          alt="title logo"
          width={1000}
          height={200}
          priority
        />
        <p>Explore the Atlas of Logic - Let the Journey Begin!</p>
        <p>定理一覧を登録すると，適切な順番に並び替えられた図（LOGISTLAS）を生成します。</p>

        <div className={styles.ctas}>
          <a
            className={styles.primary}
            href="main"
            target="_blank"
            rel="noopener noreferrer"
          >
            さっそく使ってみる
          </a>
          <a
            href="about"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.secondary}
          >
            使い方を学ぶ
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
}
