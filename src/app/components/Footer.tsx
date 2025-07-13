import React from 'react';
import styles from '../../app/page.module.css';
const currentYear = new Date().getFullYear();
import { LAUNCH_YEAR } from '../const';

export default function Footer() {
    return (
        <footer className={styles.footer}>
        <p>&copy; {currentYear === LAUNCH_YEAR ? `${LAUNCH_YEAR}` : `${LAUNCH_YEAR}-${currentYear}`} LogPiyo. All rights reserved.</p>
      </footer>
    )
}