import React from 'react';
import { View, StyleSheet, Text, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import { Icon } from '@rneui/themed';
import BackButton from '../components/BackButton';

export default function AboutUsScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#1A1A2E" />
            <BackButton />
            <ScrollView style={styles.scrollView}>
                <View style={styles.header}>
                    <Icon name="info-circle" type="font-awesome-5" color="#11998e" size={40} />
                    <Text style={styles.title}>Sobre Nós</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Sobre o Aplicativo</Text>
                    <Text style={styles.text}>
                        O iTBI-calc é uma aplicação desenvolvida para facilitar o cálculo e gestão do Imposto sobre Transmissão de Bens Imóveis (ITBI).
                        Com uma interface intuitiva e recursos avançados, o aplicativo auxilia proprietários e profissionais do setor imobiliário
                        a gerenciarem seus imóveis e cálculos tributários de forma eficiente.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Nossa Missão</Text>
                    <Text style={styles.text}>
                        Nossa missão é simplificar o processo de cálculo e gestão do ITBI, tornando-o mais acessível e transparente para todos os usuários.
                        Buscamos constantemente melhorar a experiência do usuário e adicionar novas funcionalidades que agreguem valor ao seu dia a dia.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Desenvolvedores</Text>
                    <View style={styles.teamMember}>
                        <Icon name="user" type="font-awesome-5" color="#11998e" size={24} />
                        <Text style={styles.teamMemberName}>Equipe de Desenvolvimento</Text>
                    </View>
                    <Text style={styles.text}>
                        Desenvolvido por uma equipe dedicada de profissionais apaixonados por tecnologia e inovação,
                        comprometidos em entregar a melhor solução para nossos usuários.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Contato</Text>
                    <Text style={styles.text}>
                        Para sugestões, dúvidas ou feedback, entre em contato conosco através do email:
                        suporte@itbicalc.com.br
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1A1A2E',
    },
    scrollView: {
        flex: 1,
    },
    header: {
        alignItems: 'center',
        padding: 20,
        paddingTop: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFF',
        marginTop: 16,
    },
    section: {
        padding: 20,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#11998e',
        marginBottom: 12,
    },
    text: {
        fontSize: 16,
        color: '#FFF',
        lineHeight: 24,
    },
    teamMember: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    teamMemberName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFF',
        marginLeft: 12,
    },
}); 