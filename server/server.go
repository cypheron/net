package server

import (
	"net"
	"github.com/skycoin/net/conn"
)

var (
	DefaultConnectionFactory = conn.NewFactory()
)

type Server struct {
	TCPAddress string
	UDPAddress string
	factory *conn.ConnectionFactory
}

func New() *Server {
	return &Server{TCPAddress: ":8080", UDPAddress: ":8081", factory:DefaultConnectionFactory}
}

func (server *Server) ListenTCP() error {
	addr, err := net.ResolveTCPAddr("tcp", server.TCPAddress)
	if err != nil {
		return err
	}
	ln, err := net.ListenTCP("tcp", addr)
	if err != nil {
		return err
	}
	for {
		c, err := ln.AcceptTCP()
		if err != nil {
			return err
		}
		connection := server.factory.CreateTCPConn(c)
		go connection.ReadLoop()
	}
}

func (server *Server) ListenUDP() error {
	addr, err := net.ResolveUDPAddr("udp", server.UDPAddress)
	if err != nil {
		return err
	}
	udp, err := net.ListenUDP("udp", addr)
	if err != nil {
		return err
	}
	udpc := conn.NewServerUDPConn(udp, server.factory)
	return udpc.ReadLoop()
}

