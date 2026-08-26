#!/usr/bin/env python3
"""Baixa os conteúdos finais Orfeu × Alquemia do Drive, pulando o que já existe."""

from __future__ import annotations

import os
import sys
import time
from pathlib import Path

import gdown

ROOT = Path(__file__).resolve().parents[1] / "docs" / "alquimia" / "conteudos-finais"

FILES: list[tuple[str, str]] = [
    ("1EZW3iVuQTFoAKhxKTZO02l6rNpd0iyTp", "00_INDEX.md"),
    ("1FoyinO0H1lKHUh18Tr9k4Q8pnW86xv4Z", "01_Proposta/2026-05-06_Orfeu-Alquemia-Proposal-v3.docx"),
    ("1tOwx76lu8B_D4vi-8bWDMXFc317mhd8p", "01_Proposta/2026-05-06_Orfeu-Alquemia-Proposal-v4.pdf"),
    ("1NrWmBkVZG07KefC5Q9tLgOpvWuR8uCpu", "02_Cases_e_Benchmarks/2026-06-08_Orfeu_BrandCase-Illy.pptx"),
    ("1tgtITs_eaESfEVC_wixKhkK7mJx-RndJ", "02_Cases_e_Benchmarks/2026-06-10_Orfeu_BrandCase-BlueBottle.pptx"),
    ("1OUOc6HbQ6hheh15ZzeslNCPxn7-JJQkU", "02_Cases_e_Benchmarks/2026-06-10_Orfeu_BrandCase-CafesBrasil.pptx"),
    ("1yKLnv-eNJgGPhAGh1ATZh6Mrl8KRUTtf", "02_Cases_e_Benchmarks/2026-06-10_Orfeu_BrandCase-CounterCulture.pptx"),
    ("1cQcd237c5mAuqBBHqCDeWfhnqQOWyqEk", "02_Cases_e_Benchmarks/2026-06-10_Orfeu_BrandCase-Intelligentsia.pptx"),
    ("11OlUghjnwWHJ76djd4fvWkw4Af9shqMw", "02_Cases_e_Benchmarks/2026-06-10_Orfeu_BrandCase-LaMarzocco.pptx"),
    ("1QzYIUGJlaN_lKlq_LOXLpELxSlJuv754", "02_Cases_e_Benchmarks/2026-06-10_Orfeu_BrandCase-Lavazza.pptx"),
    ("1_8d6XM_mt378MFTfOZ_DuM4kvBWBTCCi", "02_Cases_e_Benchmarks/2026-06-10_Orfeu_BrandCase-Nespresso.pptx"),
    ("1J8tOvwOvaTcn5I0jGx83n3LrKPjaUeH6", "02_Cases_e_Benchmarks/2026-06-10_Orfeu_BrandCase-StarbucksReserve.pptx"),
    ("15TIqndwMQhmrmOO1oQyvy89h7rc-gUFT", "02_Cases_e_Benchmarks/2026-06-10_Orfeu_BrandCase-Stumptown.pptx"),
    ("1KTF5T0PWokwNHJeLg3771fCg96_CSTCy", "02_Cases_e_Benchmarks/2026-06-10_Orfeu_BrandCase-TimHortons.pptx"),
    ("1YFLZ6MRscfkpOdfNGF9PlDvajD2nl8o2", "02_Cases_e_Benchmarks/2026-06-11_Orfeu_BrandCase-JuanValdez.pptx"),
    ("1JNZwkZnSgvXicxxBHPRpFsEqsXaqoevx", "02_Cases_e_Benchmarks/2026-06-11_Orfeu_BrandCase-Peets.pptx"),
    ("1Tn7ydtwTa1v0ICSdPULkkQR0tw9PfQsB", "02_Cases_e_Benchmarks/2026-06-19_Orfeu_BrandCase-Baggio.md"),
    ("1w_qeq0sS510_ezanpWSoCoOV2SMs-a_l", "02_Cases_e_Benchmarks/2026-06-19_Orfeu_BrandCase-Italle.md"),
    ("1s9qouhoGq48DscNMT0RMWoSkUdd5FbF3", "02_Cases_e_Benchmarks/2026-06-19_Orfeu_BrandCase-UniqueCafes.md"),
    ("1iNCFO2ymBH7AsD4xiq0JINFwznLP-uL-", "02_Cases_e_Benchmarks/2026-06-19_Orfeu_Framework-DTC-Marketplaces.md"),
    ("1DW-o7VLO5lS_COywE-N_LKvpnTxyIOLW", "02_Cases_e_Benchmarks/2026-07-02_Orfeu_BrandCase-3Coracoes.pptx"),
    ("1QNWwDFrO8ZVo1D4oZJ2b79MLd51CZpmD", "02_Cases_e_Benchmarks/2026-07-06_Orfeu_BrandCase-3Coracoes-Suplemento.pptx"),
    ("1AF7vAIT5L17poKH4FMycg9ObE6quYvGB", "02_Cases_e_Benchmarks/2026-07-06_Orfeu_BrandCase-Illy-Suplemento.pptx"),
    ("1CoBUuBZyTkxHHLyAXmABr15Zm9jus17G", "02_Cases_e_Benchmarks/2026-07-22_Orfeu_CaseStudy-StarbucksReserve.pptx"),
    ("1XwlJSIBWEKbfZYLNhxskkooGCHVi68VF", "02_Cases_e_Benchmarks/Métodos Orfeu.pptx"),
    ("1DM8l8GoZ3SwgVP4lxkEw5dbxWMIU5bhO", "03_Workshops/2026-07-31_Orfeu_Plano-Comercial-Workshop-vPos-Priscila.key"),
    ("1z5VMCGM4I7kyhkNDylDvrk1JZCOXj9uq", "03_Workshops/2026-08-03_Orfeu_Emails-Follow-WS-Fazenda.docx"),
    ("126M1H7jujCkvK4tKHiIf6bEy0z5snXZY", "03_Workshops/2026-08-05_Orfeu_Convites-Workshop-Fazenda-Sertaozinho.docx"),
    ("1JwNF4F-IEHTiqmWO6eFvEIkmxsrT-ws_", "03_Workshops/2026-08-07_Orfeu_Abertura WS-CEO.pptx"),
    ("1LEGBe3MltIzHiUaePSeLKtAB8BQs3NwY", "03_Workshops/2026-08-12_Orfeu_O-Jeito-Orfeu-de-Planejar-e-Entregar.pptx"),
    ("1L3socQqFZ_WeVEbgOv5UhhlVYAnsjqiw", "03_Workshops/2026-08-17_Orfeu_Resumo-Colin-Pos-Workshop.pptx"),
    ("18MQTxMcyupqEJfpHspYcD3fxoGnHbHv9", "03_Workshops/2026-08-24_Orfeu_Revisao-Plano-Reunioes-Workshops.docx"),
    ("1CVdzeLn2kzd09VLkeMn1HkijTAPVAx4g", "04_Atas_de_Reuniao/Conversas-Trade/Follow Cris - B2B e Trade.md"),
    ("1LPo6DFepCdkUBt-hiyyTn5iruviN0QqD", "04_Atas_de_Reuniao/Conversas-Trade/Follow Priscila - Varejo e Trade.md"),
    ("1jX2yxOSqm7c5uPXuCcy8xpR81jkOCBOn", "04_Atas_de_Reuniao/Conversas-Trade/Follow Silvia - Trade Orfeu.md"),
    ("1zCkZ3R_RGyaeZ_1eL_7JI3mnweH6qboQ", "04_Atas_de_Reuniao/Notas-IA-Reunioes-ate-03Jul/Orfeu-Felipe-Notas-ate-6Jul.md"),
    ("1y77K9fycasfP2aYYbp5ZcNZ544DEwO2k", "04_Atas_de_Reuniao/Notas-IA-Reunioes-ate-03Jul/Reuniao-Augusto-Felipe-226.md"),
    ("1C1_b6Vw6-84N_t4x0-0_hi3buvx2wJEA", "04_Atas_de_Reuniao/Notas-IA-Reunioes-ate-03Jul/Reuniao-Fabio-Felipe-226.md"),
    ("13pQfPVMZt6X7JN81JY7b1i9SsOCx541v", "04_Atas_de_Reuniao/Notas-IA-Reunioes-ate-03Jul/Reuniao-Fabio-e-Felipe-126.md"),
    ("1q8YsYtTqTIBmAqZVPHhLPoUqMbhvKhAT", "04_Atas_de_Reuniao/Notas-IA-Reunioes-ate-03Jul/Reuniao-Madureira-Felipe-Andres-19Jun.md"),
    ("1G9cy0O9mIAZIK67QtDL-nqkb6UrVLLBZ", "04_Atas_de_Reuniao/Notas-IA-Reunioes-ate-03Jul/Reuniao-Madureira-Felipe-Andres-206.md"),
    ("1f5cOowwG3IvVPJsxnkLh0-uz1_oFwOrM", "04_Atas_de_Reuniao/Notas-IA-Reunioes-ate-03Jul/Reuniao-quinzenal-Augusto-Felipe-27.md"),
    ("19_GYlb98pqOvslM39gQawUHUQO2Q0LYK", "04_Atas_de_Reuniao/Notas-IA-Reunioes-ate-03Jul/Reuniao-Selton-Felipe-246.md"),
    ("1t5zcKU1ibeF_LoRXkCJK7g3njN3zHKC_", "04_Atas_de_Reuniao/Notas-Omnichannel-ate-16Jul/Acompanhamento-Felipe-Amanda-Selton-time-online.md"),
    ("1s0l-CBxwgmRMawMp9jEJaWiNmWQNyvGP", "04_Atas_de_Reuniao/Notas-Omnichannel-ate-16Jul/Acompanhamento-Omnichannel-KPIs-Varejo-167.md"),
    ("1vcSpGV88BeQ_hSnjok2pkBaYvvGbeH-m", "04_Atas_de_Reuniao/Notas-Omnichannel-ate-16Jul/Acompanhamento-Omnichannel-Lideranca-Orfeu-137.md"),
    ("1AnWSnuYe-QyIkuKR0GWMYeLeluoeEaWt", "04_Atas_de_Reuniao/Notas-Omnichannel-ate-16Jul/Catch-up-Selton-Felipe-Omnichannel-Orfeu-13-7.md"),
    ("1kkSNzROBga3ah6VmCWtSuGAWr9PbDwFO", "04_Atas_de_Reuniao/Notas-Omnichannel-ate-16Jul/Fabio-Orfeu-Acompanhamento-Omnichannel-157.md"),
    ("1oFiEuXTgyGtoxCwVUE2CIjOUhuBlzLTa", "04_Atas_de_Reuniao/Notas-Omnichannel-ate-16Jul/Reuniao-com-Augusto-Omnichannel-Orfeu-137.md"),
    ("1OHCXYv52nrHWtDJ4ke0JOJoGYvIGqo1M", "04_Atas_de_Reuniao/Notas-Semana-05Jul/Felipe-Amanda-Follow.md"),
    ("1ryCoRcMfvsKXlWvZE-mV5Od-kQ7FdSI6", "04_Atas_de_Reuniao/Notas-Semana-05Jul/Felipe-Andres-Orfeu-Design-follow-up.md"),
    ("1hLKZiZIeCMqHxxvq8KDwT-wo5vk7beQw", "04_Atas_de_Reuniao/Notas-Semana-05Jul/Felipe-Augusto-follow.md"),
    ("1VeDqgbThw8f2nsLj1665cCCDKD3O5rHa", "04_Atas_de_Reuniao/Notas-Semana-05Jul/Felipe-Selton-follow.md"),
    ("1h6CxufUbjBKvTpF_496piK-P0fv5M4yo", "04_Atas_de_Reuniao/Notas-Semana-05Jul/Follow-Fabio-Felipe-Leticia-Diego-Caio-Prioridade-de-mercados.md"),
    ("1gZk6VUe0TrxPv1lRg5jPoreUAkuftvDm", "04_Atas_de_Reuniao/Notas-Semana-05Jul/Orfeu-Follow-as-of-Friday-July10th.md"),
    ("1uUJLIWaXiELqWBjFuFDiSToKEKmCGBFW", "04_Atas_de_Reuniao/Notas-Semana-05Jul/Rafaela-e-Felipe-follow-up-para-Financeiro.md"),
    ("1ruq112TAK8sst9S-Il7C7fOwoYLCnuTZ", "04_Atas_de_Reuniao/Notas-Semana-05Jul/Renato-Online-Foco-follow-B2B-para-online-e-Amazon-US.md"),
    ("1jAGSA0LdXG8MFaEdebNB3wNRVcx2ztSY", "04_Atas_de_Reuniao/2026-04-16_Orfeu_Origem-Oportunidade-Consultoria.md"),
    ("1d51CNVRHN3kr1EYn6X-JOsntxEPkSgTO", "04_Atas_de_Reuniao/2026-05-04_Orfeu-Alquemia_Pitch-Deck-Script.md"),
    ("1QOs7wGcTRNsTV4ZthnCNsUGzFEP-MQA7", "04_Atas_de_Reuniao/2026-06-22_Madureira_Meeting-Recap.md"),
    ("12bYWf1X7XS7-iKc2Mrl6dWCyA0qyJ3fG", "05_Comercial_e_Organograma/2026-08-05_Orfeu_Simulador-Comercial-Estados.xlsx"),
    ("1-bnztj_6jf39aGzCXKrEklp6Ui_AX_J2", "05_Comercial_e_Organograma/2026-08-07_Orfeu_Plano-de-Acao.xlsx"),
    ("1W0S0hfa64h4Pfpsxtgu_XJl61KIsPCRW", "05_Comercial_e_Organograma/2026-08-17_Orfeu_Organograma-Comercial-2026-2030.pptx"),
    ("1CdmDaqi-AQe9RzffIEc04SMW6aWd-L3c", "05_Comercial_e_Organograma/2026-08-20_Orfeu_RH-Competencias-Lideranca-Completo.pptx"),
    ("18noyFcOtyl_7oMFIVGXrTPbAQWO9fT3r", "05_Comercial_e_Organograma/Organograma_Time_Comercial_SNomes.xlsx"),
    ("1Kj7tANx8Ey7UMgMvat8L3hAICFy6e-NQ", "06_Expansao_EUA/2026-06-08_Orfeu_US-Research-Plan.docx"),
    ("1U_juetAJrmMly0irlQ1CweE2Fl9Y9N7H", "06_Expansao_EUA/2026-07-07_Orfeu_Mintel-Analise-Cruzada.docx"),
    ("1mbPGAdvd3_Gh_RTJRyZfhVFi-B3S9V8H", "06_Expansao_EUA/2026-07-07_Orfeu_NCDT-Analise-Cruzada.docx"),
    ("1FyNi2GfcJMJnJjRv3AH_-XEJzfpo3dgw", "06_Expansao_EUA/2026-07-17_Orfeu_Euromonitor-US-Analysis.xlsx"),
    ("1MSkqiKp8jEyVLThOZp_5PjuO_ysh4i8c", "06_Expansao_EUA/2026-07-17_Orfeu_Influenciadores-Digital-Cafe.pptx"),
    ("1-EO7MuXTgFRfrBv5P_d_iDr60TsqT5It", "06_Expansao_EUA/2026-07-17_Orfeu_KCup-Oportunidade.pptx"),
    ("1OCA8CcsYuIVrfPjCAS07iExHv_8GtebU", "06_Expansao_EUA/2026-07-17_Orfeu_Tarifas-Importacao-EUA.pptx"),
    ("1Qf_aoAXDubzJVdc8DuBBkl4ezhg97nlz", "06_Expansao_EUA/2026-07-22_Orfeu_Visita-Mercado-EUA.pptx"),
    ("1x4gtVbf_P8QGZ1eQJOhEY6XpRUoNJVO1", "06_Expansao_EUA/2026-08-05_Orfeu_10-Provocacoes-Mercado-US.pptx"),
    ("1WaWJzBlHMsaYIOW9SOdfjl3YBm2EJY2U", "06_Expansao_EUA/2026-08-05_Orfeu_Plano-Comercial-SulFlorida.pptx"),
    ("1WNsDm3pkxTQZmH0Hj1CW6yTnJ365OFhJ", "06_Expansao_EUA/2026-08-12_Orfeu_Plano-de-Acao-EUA.xlsx"),
    ("16CZ4sF6Ricf52b69VzYK5nSYyJ8VazcZ", "06_Expansao_EUA/2026-08-17_Orfeu_Prep-Entrevistas-Cadeia-EUA.pptx"),
    ("17gsxijC2tELyKAYPP7YVVfIawhvW7wlY", "06_Expansao_EUA/2026-08-19_Orfeu_Benchmark-Precos-Premium.pptx"),
    ("1dvMB9opOnGUI--S1jP7yEhYYjpeJtHMU", "06_Expansao_EUA/2026-08-19_Orfeu_Cadeia-Modelo-Comercial-EUA.pptx"),
    ("1CTdncOKLoy_5TriJrChVFBYS9yVJL45j", "06_Expansao_EUA/2026-08-20_Orfeu_Outreach-LinkedIn-Distribuidores-EUA.docx"),
    ("1awF5nCOzAdeUtzPlWvRN_A4MF1VQG4Wx", "06_Expansao_EUA/Preliminar-2026-06-30_Orfeu_Apresentacao-GTM-EUA.pptx"),
    ("1YbjZbjc1EYhnaXIRTzNFBpGqvDi1TeeR", "06_Expansao_EUA/Preliminar-2026-06-30_Orfeu_Relatorio-GTM-EUA-A.docx"),
    ("1lDnEbNmkWd-Z0vZL_uvZLT89bRQFLQs9", "06_Expansao_EUA/Preliminar-2026-06-30_Orfeu_Relatorio-GTM-EUA-B.docx"),
    ("1aSDBzDJ36Qah2CNpavq3CT_tKCEXmJPo", "06_Expansao_EUA/Preliminar-2026-06-30_Orfeu_Relatorio-GTM-EUA-C.docx"),
    ("1IUu2_s3xAOmhLMMlQXAO8olUgs7wWX1O", "06_Expansao_EUA/Pricing-Email-Orfeu-KeHe.pdf"),
    ("18YLFb1OIkEFPGwVJDWruxClGaziJ1hLg", "07_Trade_Marketing_e_Categoria/2026-06-11_Orfeu_B2B-CustomerJourney-Brief-v2-PosWorkshopB2B.pptx"),
    ("11qCNX4qLm36vsni35d8loGUgRR6drIIt", "07_Trade_Marketing_e_Categoria/2026-07-10_Orfeu_B2B-Solucoes-TurismoOffice-v2-PosWorkshopB2B.pptx"),
    ("1O7GEIfFBkLAweFo65cZ23H3-ebotlg_z", "07_Trade_Marketing_e_Categoria/2026-07-10_Orfeu_Trade20-Atividades-RACI-v2.xlsx"),
    ("1nA8T6DRDUhI5nMVPPlpPX84erKp6K6Ok", "07_Trade_Marketing_e_Categoria/2026-07-13_Orfeu_GTM-B2B-e-KPIs-vPos-Amanda.xlsx"),
    ("10ilz7OAClEz7tYy0cBk-gZDNaRDGEL3c", "07_Trade_Marketing_e_Categoria/2026-07-22_Orfeu_Calendario-Omnichannel-Unico.pptx"),
    ("1JUTLl5is15qOk9NtVdiwr8Dzu95iVl1u", "07_Trade_Marketing_e_Categoria/2026-08-05_Orfeu_Plano-de-Acao-Liberacao-Redes-Scanntech.xlsx"),
    ("1R76swXV2Bc-6k0Pdci2XPFbKhSvA3vIW", "07_Trade_Marketing_e_Categoria/2026-08-17_Orfeu_Ideias-Gerenciamento-Categoria-GPA.pptx"),
    ("1_H9WTkmRnx9-petMgivc39NgaoAC7ZyQ", "08_Analytics_e_Mix/2026-07-10_Orfeu_Indicadores-vendas-omnichannel.xlsx"),
    ("1H7LgUIV_aIXNCbI3y6G9aUFbSGiY_fqN", "08_Analytics_e_Mix/2026-07-17_Orfeu_Tendencias-Mercado-2026_vFinal.pptx"),
    ("175tiGgaS34FqdRl3uIP3ZD6iI60L--dx", "08_Analytics_e_Mix/2026-08-07_Orfeu_Analitico-para-Varejo-Evolucao.pptx"),
    ("1KNULDtTyF4InPaiu6b7HVWymqtOAlqPO", "08_Analytics_e_Mix/2026-08-18_Orfeu_Analise-Mix-Oportunidade-v2.pptx"),
    ("1CKKS-QLxenHkBBuWMuxVx713dM0An0ow", "09_Flagship_Loja_Conceito/2026-07-17_Orfeu_Flagship-Strategy-vFinal.pdf"),
    ("1QwoNYDCkJvPF-V_H2ixuDGhFER3lmrUR", "09_Flagship_Loja_Conceito/2026-08-05_Orfeu_Flagship-Resumo-3Paginas.pptx"),
    ("1sLphZ-fC73PcMWiP9d8-eWlWIRJl4fen", "10_IA_PixelPulseLab/2026-08-07_Orfeu_Sensibilidade-Investimento-Sistemas.pptx"),
    ("1_bHdFDAq3O1eLH7FWcAHL_d1m596G6hp", "10_IA_PixelPulseLab/2026-08-07_Orfeu_Simulador-Sensibilidade-Investimento-Sistemas.xlsx"),
    ("14qoIqBIfBnsZOiTe411_W541v2ciuo4P", "10_IA_PixelPulseLab/2026-08-08_Orfeu_Workshop-Priorizacao-PixelPulseLab.pptx"),
    ("12UMoVG5mRUIVbFGhEFisT8b79fzKg7oI", "10_IA_PixelPulseLab/2026-08-09_Orfeu_Comparador-Rates-PixelPulseLab-Mercado.pptx"),
    ("1XmcXQOscaYeJkOuRFc3TUrHzGyRFYH9P", "10_IA_PixelPulseLab/2026-08-09_Orfeu_Comparador-Rates-PixelPulseLab-Mercado.xlsx"),
    ("1OfDXFsAGSSqIGYUl4uDT-pPqHfcT3JeI", "10_IA_PixelPulseLab/2026-08-11_Orfeu_Proposta-PixelPulseLab-Completa.pptx"),
    ("1rKzRhDnHQ24e3WkOhM-C66L30CIN243s", "10_IA_PixelPulseLab/2026-08-17_Orfeu_Briefing-Cotacao-OrderToCash-IA.docx"),
]


def already_downloaded(path: Path) -> bool:
    return path.exists() and path.stat().st_size > 64


def download_one(file_id: str, relative: str) -> str:
    dest = ROOT / relative
    dest.parent.mkdir(parents=True, exist_ok=True)
    if already_downloaded(dest):
        return "skip"
    url = f"https://drive.google.com/uc?id={file_id}"
    try:
        gdown.download(url, str(dest), quiet=True)
        if already_downloaded(dest):
            return "ok"
        if dest.exists():
            dest.unlink()
        return "empty"
    except Exception as error:  # noqa: BLE001
        if dest.exists() and dest.stat().st_size <= 64:
            dest.unlink()
        return f"error:{error}"


def main() -> int:
    ROOT.mkdir(parents=True, exist_ok=True)
    ok = skip = fail = 0
    failed: list[str] = []
    for file_id, relative in FILES:
        status = download_one(file_id, relative)
        if status == "ok":
            ok += 1
            print(f"OK   {relative}")
        elif status == "skip":
            skip += 1
            print(f"SKIP {relative}")
        else:
            fail += 1
            failed.append(f"{relative} ({status})")
            print(f"FAIL {relative} {status}")
            time.sleep(0.4)
    print(f"\nDone. ok={ok} skip={skip} fail={fail} total={len(FILES)}")
    if failed:
        print("Failed files:")
        for item in failed:
            print(f" - {item}")
    return 0 if fail == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
